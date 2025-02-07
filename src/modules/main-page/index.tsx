'use client';

import { useState } from 'react';
import Head from 'next/head';
import { Geist, Geist_Mono } from 'next/font/google';
// import { Button } from '@mantine/core';
import {storage} from '@/shared/lib/storage';
import Link from '@/widgets/link/link';
import styles from './main-page.module.scss';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export type LinkType = {
  url: string;
  title: string | null;
  description?: string | null;
  icon?: string | null; // base64
};

export default function MainPage() {
  const savedLinks = storage.get('savedLinks');
  let parsedLinks: LinkType[];

  if (!savedLinks) {
    parsedLinks = [
/*      {
        url: 'https://ya.ru',
        title: 'ya.ru',
        icon: '',
        description: '',
      },*/
    ];
  } else {
    parsedLinks = JSON.parse(savedLinks);
  }

  const areLinksValid = parsedLinks && Array.isArray(parsedLinks);

  console.log('parsedLinks:', parsedLinks);

  const [url, setUrl] = useState('');
  const [previewData, setPreviewData] = useState<LinkType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPreviewData(null);

    try {
      const response = await fetch(`/api/get_info?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch URL information');
      }

      const data = await response.json();
      setPreviewData(data);
      parsedLinks.push(data);
      storage.set('savedLinks', JSON.stringify(parsedLinks));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

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

          <ul>
            {areLinksValid ?
              parsedLinks.map((link, index) => (
                <Link key={index} link={link}/>
              )) :
              null
            }
          </ul>

          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1>Link Preview</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
              <button
                type="submit"
                disabled={isLoading}
                style={{ marginTop: '10px', padding: '10px 20px', fontSize: '16px' }}
              >
                {isLoading ? 'Loading...' : 'Preview'}
              </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {previewData && (
              <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                {previewData.icon && (
                  <img
                    src={previewData.icon}
                    alt="Website Icon"
                    style={{ width: '64px', height: '64px', marginBottom: '10px' }}
                  />
                )}
                <h2>{previewData.title}</h2>
                <p>{previewData.description}</p>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </main>
        <footer className={styles.footer}>
        </footer>
      </div>
    </>
  );
}
