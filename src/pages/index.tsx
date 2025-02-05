import Head from "next/head";
// import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/home.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Start page</title>
        <meta name="description" content="Start page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          Start page
        </main>
        <footer className={styles.footer}>
        </footer>
      </div>
    </>
  );
}
