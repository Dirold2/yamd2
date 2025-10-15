import { HttpClientInterface } from "hyperttp";
/**
 * GET: clck.ru/--
 * @param URL Url to shorten
 * @param client Optional custom HTTP client
 * @returns Promise<string> - shortened link
 */
export default function shortenLink(URL: string, client?: HttpClientInterface): Promise<string>;
