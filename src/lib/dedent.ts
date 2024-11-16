/*
the npm dedent library (https://www.npmjs.com/package/dedent) has a lot of weird behavior involving backslashes, first-line behavior, and escaping of dollar sign tags
so we've created this simple version instead
*/

const DEBUG = false;

export function dedent(strings: TemplateStringsArray, ...values: unknown[]) {
  // find the minimum indentation in any string of `strings`
  let minIndent = -1;
  for (let i = 0; i < strings.length; i++) {
    const str = strings[i]!;
    const lines = str.split("\n");
    for (let j = 0; j < lines.length; j++) {
      if (i > 0 && j === 0) {
        // skip the first line for all but the first string
        continue;
      }
      const line = lines[j]!;
      if (
        line.trim() === "" && // is a whitespace only line
        // doesn't have a tag right after it
        // that means, it's either:
        //   1. not the last line in this string
        //   2. or, the last line in this string and there is no value that will go after it
        // case 1: not the last line in this string
        (j !== lines.length - 1 ||
          // case 2: the last line in this string (implicit based on not meeting above condition) and there is no value that will go after it
          i >= values.length)
      ) {
        // we don't want to consider a whitespace-only line
        if (DEBUG) {
          console.log(`Skipping whitespace-only line: "${line}"`);
          console.log(
            `i: ${i}, j: ${j}, strings.length: ${strings.length}, values.length: ${values.length}`,
          );
        }
        continue;
      }
      let leadingSpaces = 0;
      for (const char of line) {
        if (char === " ") {
          leadingSpaces++;
        } else {
          break;
        }
      }
      if (DEBUG) {
        console.log(`Line: "${line}", Leading spaces: ${leadingSpaces}`);
      }
      if (minIndent == -1 || leadingSpaces < minIndent) {
        minIndent = leadingSpaces;
      }
    }
  }

  if (minIndent == -1) {
    // all lines have only whitespace
    minIndent = 0;
  }

  if (DEBUG) {
    console.log(`Minimum indentation: ${minIndent}`);
  }

  // dedent the strings
  const newStrings = strings.map((str, index) => {
    let lines = str.split("\n");
    if (index > 0) {
      // if we're not in the first string, then the first "line" actually starts after a tag, not at the beginning of a line, so don't dedent it
      lines = [
        lines[0]!,
        ...lines.slice(1).map((line) => line.slice(minIndent)),
      ];
    } else {
      // we're in the first string, so we dedent even the first line
      lines = lines.map((line) => line.slice(minIndent));
    }
    return lines.join("\n");
  });

  let res = "";
  for (let i = 0; i < newStrings.length; i++) {
    res += newStrings[i];
    if (i < values.length) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      res += `${values[i]}`; // use string template to ensure exactly-correct string conversion behavior
    }
  }

  const resLines = res.split("\n");
  const firstLine = resLines[0];
  const middleLines = resLines.slice(1, resLines.length - 1);
  const lastLine = resLines[resLines.length - 1];
  if (
    firstLine === undefined ||
    lastLine === undefined ||
    firstLine != "" ||
    lastLine != ""
  ) {
    throw new Error(
      "Decent must be used with the begin and end backticks on their own like. Example:\n\n  const newString = dedent`\n    first line of text here\n    second line of text here\n  `;",
    );
  }

  return middleLines.join("\n");
}
