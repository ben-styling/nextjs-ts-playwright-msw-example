// This is used by next-fixture.ts to pass requestInterceptor to each test,
// where it can be used to set up the server-side request mocks.
import * as React from "react";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}
