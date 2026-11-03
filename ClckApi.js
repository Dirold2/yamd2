"use strict";import{HyperClient as n}from"hyperttp";import{clckApiRequest as o}from"./PreparedRequest/index.js";const u=new n;export default function s(t,r=u){const e=o().setPath("/--").addQuery({url:t});return r.get(e.url,{headers:e.headers})}
//# sourceMappingURL=ClckApi.js.map
