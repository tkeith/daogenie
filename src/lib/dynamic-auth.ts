import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";
import { z } from "zod";

const dynamicDecodedTokenSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  environment_id: z.string(),
  verified_credentials: z.array(
    z.discriminatedUnion("format", [
      z.object({
        format: z.literal("blockchain"),
        address: z.string(),
        chain: z.string(),
        id: z.string(),
        public_identifier: z.string(),
        wallet_name: z.string(),
        wallet_provider: z.string(),
        lastSelectedAt: z.string(),
        signInEnabled: z.boolean(),
      }),
      z.object({
        format: z.literal("email"),
        email: z.string().email(),
        id: z.string(),
        public_identifier: z.string(),
        signInEnabled: z.boolean(),
      }),
    ]),
  ),
  last_verified_credential_id: z.string(),
  first_visit: z.string(),
  last_visit: z.string(),
  new_user: z.boolean(),
});

export async function getDynamicUserInfoFromAuthToken({
  encodedJwt,
}: {
  encodedJwt: string;
}) {
  const jwksUrl = `https://app.dynamic.xyz/api/v0/sdk/${env.DYNAMIC_ENV_ID}/.well-known/jwks`;

  const client = new JwksClient({
    jwksUri: jwksUrl,
    rateLimit: true,
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 600000,
  });

  const signingKey = await client.getSigningKey();
  const publicKey = signingKey.getPublicKey();

  let decodedToken: unknown;
  try {
    decodedToken = jwt.verify(encodedJwt, publicKey);
  } catch (error) {
    return {
      result: "InvalidToken" as const,
    };
  }

  return {
    result: "Success" as const,
    userInfo: dynamicDecodedTokenSchema.parse(decodedToken),
  };
}

export async function trpcGetUserInfo({ authToken }: { authToken: string }) {
  const userInfoRequest = await getDynamicUserInfoFromAuthToken({
    encodedJwt: authToken,
  });

  if (userInfoRequest.result !== "Success") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired token",
    });
  }

  const { userInfo } = userInfoRequest;

  return userInfo;
}
