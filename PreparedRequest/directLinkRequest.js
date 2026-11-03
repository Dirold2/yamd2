"use strict";import{Request as r}from"hyperttp";import{URL as o}from"node:url";export default function s(t){const e=new o(t);return new r({scheme:e.protocol.slice(0,-1),host:e.hostname,port:e.port?Number(e.port):e.protocol==="https:"?443:80,path:e.pathname,query:Object.fromEntries(e.searchParams.entries()),headers:{},bodyData:void 0})}
//# sourceMappingURL=directLinkRequest.js.map
