import type { CheerioAPI } from 'cheerio';

import axios from 'axios';
import { load } from 'cheerio';

export async function getHtml(url: string): Promise<CheerioAPI> {
  const { data }: { data: string } = await axios.get(url);
  return load(data);
}
