import type { AppProps } from "next/app";
import Head from 'next/head';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import "@/styles/globals.css";
import '@mantine/core/styles.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <ColorSchemeScript />
      </Head>
      <MantineProvider>
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}
