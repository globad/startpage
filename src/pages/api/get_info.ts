import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextApiRequest, NextApiResponse } from 'next';

interface UrlPreview {
  url: string;
  title: string | null;
  description?: string | null;
  icon?: string | null; // base64
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UrlPreview | { error: string }>
) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Делаем запрос к указанному URL
    const { data } = await axios.get<string>(url);

    // Загружаем HTML в cheerio
    const $ = cheerio.load(data);

    // Извлекаем заголовок страницы
    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || null;

    // Извлекаем описание страницы
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || null;

    // Извлекаем иконку сайта
    let iconUrl = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || null;
    let iconBase64 = null;

    // Если иконка найдена, скачиваем её и преобразуем в base64
    if (iconUrl) {
      // Преобразуем относительный URL в абсолютный
      if (!iconUrl.startsWith('http')) {
        const baseUrl = new URL(url).origin;
        iconUrl = new URL(iconUrl, baseUrl).toString();
      }

      // Скачиваем изображение
      const iconResponse = await axios.get(iconUrl, { responseType: 'arraybuffer' });
      const iconBuffer = Buffer.from(iconResponse.data, 'binary');
      iconBase64 = `data:${iconResponse.headers['content-type']};base64,${iconBuffer.toString('base64')}`;
    }

    // Возвращаем извлеченные данные в формате JSON
    res.status(200).json({
      url: url,
      title: title,
      description: description,
      icon: iconBase64,
    });
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.status(500).json({ error: 'Failed to fetch URL information' });
  }
}
