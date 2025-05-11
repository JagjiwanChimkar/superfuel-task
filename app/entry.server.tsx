/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { AppLoadContext, EntryContext } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { connect } from "mongoose";
import ReactDOM from "react-dom/server";
import vm from "vm";

export const executeCode = async (code: string) => {
  try {
    const context = {
      console: {
        log: (...args: any[]) => {
          return args.join(" ");
        },
      },
    };

    const result = vm.runInNewContext(code, context);
    return {
      success: true,
      result: result,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      result: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

connect("mongodb://localhost:27017/local" as string)
  .then(() => console.log({ mongoDb: "Connected" }))
  .catch((err) => {
    console.log({ mongoErr: err });
  });

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext
) {
  let status = responseStatusCode;
  const headers = new Headers(responseHeaders);
  headers.set("Content-Type", "text/html, charset=utf-8");

  const body = await ReactDOM.renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        // Log streaming rendering errors from inside the shell
        console.error(error);
        status = 500;
      },
    }
  );

  if (isbot(request.headers.get("user-agent") || "")) {
    await body.allReady;
  }

  return new Response(body, {
    headers,
    status,
  });
}
