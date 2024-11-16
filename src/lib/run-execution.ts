import { db } from "@/server/db";
import { ExecutionStatus } from "@prisma/client";
import { getAutoKillingBrowserPage } from "@/lib/getAutoKillingBrowserPage";
import {
  defineTool,
  runAgenticConversation,
  simpleAnthropicQuestion,
} from "@/lib/anthropic";
import { z } from "zod";
import { sendEth } from "@/lib/send-eth";
import { dedent } from "@/lib/dedent";
import assert from "assert";
import { configureAloria, runAloria } from "aloria";
import { env } from "@/env";
import { PLAYBOOKS } from "@/lib/playbooks";
import { performOCR } from "@/lib/ocr";
import fs from "fs";
import { getAllFramesText } from "@/lib/all-frames-text";

export const WEB_TASK_TIME_LIMIT_MS = 1000 * 60 * 30; // 30 minutes

export const WEB_ELEMENT_WAIT_TIMEOUT_MS = 1000 * 3; // 3 seconds

export async function runExecution(executionId: number) {
  const execution = await db.execution.findUniqueOrThrow({
    where: { id: executionId },
    include: {
      treasury: true,
    },
  });

  try {
    const res = await innerRunExecution({
      description: execution.description,
      treasuryAddress: execution.treasury.address,
      treasuryPrivateKey: execution.treasury.privateKey,
    });
    // update execution status to COMPLETE and result
    await db.execution.update({
      where: { id: executionId },
      data: { status: ExecutionStatus.COMPLETE, result: res.result },
    });
  } catch (e) {
    console.error("Error in runExecution:", e);
    // print stack trace
    console.error((e as Error).stack);
    // update execution status to ERROR and error
    await db.execution.update({
      where: { id: executionId },
      data: { status: ExecutionStatus.ERROR, error: (e as Error).message },
    });
  }
}

async function innerRunExecution({
  description,
  treasuryAddress,
  treasuryPrivateKey,
}: {
  description: string;
  treasuryAddress: string;
  treasuryPrivateKey: string;
}): Promise<{ result: string }> {
  const { page, closeBrowser } = await getAutoKillingBrowserPage();
  configureAloria({
    apiKey: env.ALORIA_API_KEY,
  });
  try {
    const startingUserMessage = dedent`
      You are an AI agent executing a task on behalf of a user. You have access to a web browser, which you can control using tools. You can also ask questions about the page that you are currently seeing using the web_question tool or get a description of the page using the describe_current_page tool.

      When filling in email addresses use daogenie@tk.co

      Task:
      <task>
      ${description}
      </task>

      When you have successfully completed the task, call the complete_task tool with a descriptive result for the user.

      You also have the following playbooks available:
      <playbooks>
      ${PLAYBOOKS.map((p, i) => `${i + 1}. ${p.name}`).join("\n")}
      </playbooks>
    `.trim();

    let conversationResult = null as null | string;

    await runAgenticConversation({
      messages: [{ role: "user", content: startingUserMessage }],
      tools: [
        defineTool({
          name: "complete_task",
          description:
            "Call this tool when you have successfully completed the task",
          inputSchema: z.object({
            result: z.string(),
          }),
          func: async ({ input: { result } }) => {
            conversationResult = result;
            return {
              type: "end_conversation",
              content: result,
            };
          },
        }),
        defineTool({
          name: "get_playbook",
          description:
            "Use this tool to get the content of a playbook by its ID (number shown in the list)",
          inputSchema: z.object({
            playbook_id: z.number(),
          }),
          func: async ({ input: { playbook_id } }) => {
            const playbook = PLAYBOOKS[playbook_id - 1];
            return {
              type: "tool_result",
              content: dedent`
                Content of playbook "${playbook?.name ?? "unknown"}":
                <playbook>
                ${playbook?.content ?? "playbook not found"}
                </playbook>
              `,
            };
          },
        }),
        defineTool({
          name: "send_eth",
          description: "Send ETH to a given address",
          inputSchema: z.object({
            to: z.string(),
            amount: z.string(),
          }),
          func: async ({ input: { to, amount } }) => {
            const txnId = await sendEth({
              privateKey: treasuryPrivateKey,
              to,
              amount,
            });
            return {
              type: "tool_result",
              content: `Sent ${amount} ETH to ${to}. Txn id: ${txnId} — Block explorer: https://eth.blockscout.com/tx/${txnId}`,
            };
          },
        }),
        defineTool({
          name: "web_simple_question",
          description:
            "Use this tool to ask a question about the current page that only requires text understanding (like fetching specific fields)",
          inputSchema: z.object({
            question: z.string(),
          }),
          func: async ({ input: { question } }) => {
            const screenshotPath = `/tmp/${Date.now()}-${Math.random()}.png`;
            await page.screenshot({ path: screenshotPath });
            const pageContent = await performOCR(screenshotPath);
            const pageContent2 = await getAllFramesText(page);
            await fs.promises.unlink(screenshotPath);
            console.log("pageContent", pageContent);
            console.log("pageContent2", pageContent2);
            const answer = await simpleAnthropicQuestion(
              dedent`
                Based on the following page content, answer the question:
                <page_content>
                ${pageContent2}
                </page_content>
                <question>
                ${question}
                </question>
              `,
            );
            return {
              type: "tool_result",
              content: answer,
            };
          },
        }),
        defineTool({
          name: "web_complex_question",
          description:
            "Use this tool to ask a question about the current page that requires visual understanding (like fetching specific fields)",
          inputSchema: z.object({
            question: z.string(),
          }),
          func: async ({ input: { question } }) => {
            const aloriaRes = await runAloria({
              page,
              task: `Answer the following question about the current page (without taking any actions like clicking or typing):\n${question}`,
              resultSchema: z.object({
                answer: z.string(),
              }),
            });
            return {
              type: "tool_result",
              content: aloriaRes.answer,
            };
          },
        }),
        defineTool({
          name: "describe_current_page",
          description: "Use this tool to describe the current page in detail",
          inputSchema: z.object({}),
          func: async () => {
            const aloriaRes = await runAloria({
              page,
              task: "Describe the current page in detail (without taking any actions like clicking or typing). You may need to scroll down if the info you need is not visible.",
              resultSchema: z.object({
                description: z.string(),
              }),
            });
            return {
              type: "tool_result",
              content: aloriaRes.description,
            };
          },
        }),
        defineTool({
          name: "wait_5_seconds",
          description: "Use this tool to wait for 5 seconds",
          inputSchema: z.object({}),
          func: async () => {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            return {
              type: "tool_result",
              content: "Waited for 5 seconds",
            };
          },
        }),
        defineTool({
          name: "web_goto_url",
          description: "Navigate to a specific URL",
          inputSchema: z.object({
            url: z.string().url(),
          }),
          func: async ({ input: { url } }) => {
            await page.goto(url);
            return {
              type: "tool_result",
              content: `Navigated to ${url}`,
            };
          },
        }),
        defineTool({
          name: "web_click_on_element_by_text",
          description: "Click on an element containing specific text",
          inputSchema: z.object({
            text: z.string(),
          }),
          func: async ({ input: { text } }) => {
            try {
              // Try exact match first
              const element = page.getByText(text, { exact: true }).first();
              await element.waitFor({ timeout: WEB_ELEMENT_WAIT_TIMEOUT_MS });
              await element.click();
              return {
                type: "tool_result",
                content: `Clicked on element with text "${text}"`,
              };
            } catch (e) {
              try {
                // If exact match fails, try fuzzy match
                const element = page.getByText(text).first();
                await element.waitFor({ timeout: WEB_ELEMENT_WAIT_TIMEOUT_MS });
                await element.click();
                return {
                  type: "tool_result",
                  content: `Clicked on element containing text "${text}"`,
                };
              } catch (e) {
                console.error("Error in web_click_on_element_by_text:", e);
                return {
                  type: "tool_result",
                  is_error: true,
                  content:
                    "Failed to find element, consider getting a description of the page and/or using the natural language action tool",
                };
              }
            }
          },
        }),
        defineTool({
          name: "web_type_text",
          description:
            "Type text into an input field identified by placeholder or label",
          inputSchema: z.object({
            text: z.string(),
            identifier: z
              .string()
              .describe("The placeholder text or label of the input field"),
          }),
          func: async ({ input: { text, identifier } }) => {
            try {
              // Try finding by placeholder
              const element = page.getByPlaceholder(identifier).first();
              await element.waitFor({ timeout: WEB_ELEMENT_WAIT_TIMEOUT_MS });
              await element.fill(text);
              return {
                type: "tool_result",
                content: `Typed "${text}" into field with placeholder "${identifier}"`,
              };
            } catch (e) {
              try {
                // If placeholder fails, try finding by label
                const element = page.getByLabel(identifier).first();
                await element.waitFor({ timeout: WEB_ELEMENT_WAIT_TIMEOUT_MS });
                await element.fill(text);
                return {
                  type: "tool_result",
                  content: `Typed "${text}" into field with label "${identifier}"`,
                };
              } catch (e) {
                try {
                  // If label fails, try finding by name
                  const element = page
                    .locator(`[name="${identifier}"]`)
                    .first();
                  await element.waitFor({
                    timeout: WEB_ELEMENT_WAIT_TIMEOUT_MS,
                  });
                  await element.fill(text);
                  return {
                    type: "tool_result",
                    content: `Typed "${text}" into field with name "${identifier}"`,
                  };
                } catch (e) {
                  console.error("Error in web_type_text:", e);
                  return {
                    type: "tool_result",
                    is_error: true,
                    content:
                      "Failed to find element, consider getting a description of the page and/or using the natural language action tool",
                  };
                }
              }
            }
          },
        }),
        defineTool({
          name: "web_natural_language_action",
          description:
            "Use this tool to perform an action on the current page by providing a natural language of the task.",
          inputSchema: z.object({
            action: z
              .string()
              .describe(
                "The action to perform, including all information needed like values to fill",
              ),
          }),
          func: async ({ input: { action } }) => {
            const aloriaRes = await runAloria({
              page,
              task: dedent`
                [RUNNER:claude-computer-control-1]Please take the following action and then call the complete_task tool. Assume the task succeeded. Do not repeat the task or do anything else.
                ${action}
              `.trim(),
              resultSchema: z.object({
                result: z.string(),
              }),
            });
            return {
              type: "tool_result",
              content: aloriaRes.result,
            };
          },
        }),
      ],
    });
    assert(conversationResult !== null, "Conversation did not complete");
    return { result: conversationResult };
  } finally {
    setTimeout(closeBrowser, 60 * 1000);
  }
}
