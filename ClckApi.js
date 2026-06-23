"use strict";import{HyperClient as n}from"hyperttp";import{clckApiRequest as o}from"./PreparedRequest/index.js";const u=new n;export default function i(t,e=u){const r=o().setPath("/--").addQuery({url:t});return e.get(r)}
//# sourceMappingURL=ClckApi.js.map
