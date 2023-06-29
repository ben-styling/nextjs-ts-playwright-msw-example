// tests/next-fixture.ts
import { createServer, Server } from "http";
import { parse } from "url";
import { expect, test as base } from "@playwright/test";
import next from "next";
import path from "path";
import { AddressInfo } from "net";
import { rest } from "msw";
import { SetupServer } from "msw/node";
import { createWorker, MockServiceWorker } from "playwright-msw";

const test = base.extend<
  {
    requestInterceptor: SetupServer;
    rest: typeof rest;
    goto: (pathname: string) => Promise<void>;
    mockBook: (book: any) => Promise<void>;
    worker: MockServiceWorker;
  },
  { app: { port: number; requestInterceptor: SetupServer } }
>({
  mockBook: async ({ app: { requestInterceptor } }, use) => {
    const mockBook = async (book: any) => {
      requestInterceptor.use(
        rest.get(`*/b/AFRW`, (_req, res, ctx) => res.once(ctx.json(book)))
      );
    };
    await use(mockBook);
  },
  worker: [
    async ({ page }, use) => {
      const server = await createWorker(page);
      await use(server);
    },
    { scope: "test", auto: true },
  ],
  app: [
    async ({}, use) => {
      const { setupServer } = await import("msw/node");
      const servers: [Server, SetupServer] = await new Promise((resolve) => {
        const server = createServer();
        const requestInterceptor = setupServer();
        requestInterceptor.listen({ onUnhandledRequest: "bypass" });
        server.addListener("request", async (req, res) => {
          const port = (server.address() as AddressInfo).port;
          const app = next({
            dev: false,
            dir: path.resolve(__dirname, ".."),
            hostname: "localhost",
            port,
          });
          await app.prepare();
          const handle = app.getRequestHandler();
          // if (typeof req.url !== 'string') throw new Error('url is not a string');
          // this is deprecated, but nextjs requires this format
          // https://nextjs.org/docs/pages/building-your-application/configuring/custom-server
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const parsedUrl = parse(req.url!, true);
          handle(req, res, parsedUrl);
        });
        server.listen(() => resolve([server, requestInterceptor]));
      });
      const port = (servers[0].address() as AddressInfo).port;
      const requestInterceptor = servers[1];
      await use({ port, requestInterceptor });
      servers[0].close();
      servers[1].close();
    },
    { scope: "worker" },
  ],
  rest,
  goto: async ({ app: { port }, page }, use) => {
    const goto = async (pathname: string) => {
      const url = `http://localhost:${port}${pathname}`;
      await page.goto(url);
      await expect(page).toHaveURL(url);
    };
    await use(goto);
  },
});
// this "test" can be used in multiple test files,
// and each of them will get the fixtures.
export default test;
