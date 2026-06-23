import { Request } from "hyperttp";
import { URL } from "node:url";

export default function directLinkRequest(url: string) {
  const parsed = new URL(url);

  return new Request({
    scheme: parsed.protocol.slice(0, -1),

    host: parsed.hostname,

    port: parsed.port ? Number(parsed.port) : parsed.protocol === "https:" ? 443 : 80,

    path: parsed.pathname,

    query: Object.fromEntries(parsed.searchParams.entries()),

    headers: {},

    bodyData: undefined,
  });
}
