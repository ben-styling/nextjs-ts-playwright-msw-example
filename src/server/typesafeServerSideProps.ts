// Why does this file exist?

// It's so you can use InferGetServerSidePropsType<typeof myServerSideProps>
// on next pages while being able to redirect and 404 while
// maintaining type safety from your sever to your client.

import { GetServerSidePropsContext } from "next";

/**
 *
 * @param path - Where to redirect to
 * @param basePath When true (default), the basePath will be prepended to the redirect path
 *
 */
export const redirect = (path: string, basePath = true, reason?: string) => {
  console.error("[redirect]: ", reason);
  throw new RedirectError(path, basePath, reason);
};

export const notFound = (reason?: string) => {
  console.error("[notFound]: ", reason);
  throw new NotFoundError(reason);
};

type CallbackFn = (ctx: GetServerSidePropsContext) => Promise<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any> & {};
}>;

export const typeSafeSSP =
  (ctx: GetServerSidePropsContext) =>
  async (fn: CallbackFn, errorFn?: (e: unknown) => void) => {
    try {
      const response = await fn(ctx);
      return {
        props: {
          ...response.props,
        },
      };
    } catch (error) {
      if (error instanceof RedirectError) {
        return {
          redirect: {
            permanent: false,
            destination: error.redirect || "/",
            basePath: error.basePath || false,
          },
        };
      }
      if (error instanceof NotFoundError) {
        return {
          notFound: true,
        };
      }
      errorFn?.(error);
      throw error;
    }
  };

export class RedirectError extends Error {
  redirect: string;
  basePath: boolean;
  constructor(redirect: string, basePath: boolean, message?: string) {
    super(message);
    this.redirect = redirect;
    this.basePath = basePath;
  }
}

export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
