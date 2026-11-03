"use strict";export async function withTimeout(o,e,r="Request timed out"){const t=new Promise((i,n)=>setTimeout(()=>n(new Error(r)),e));return Promise.race([o,t])}export async function withRetry(o,e,r){for(let t=0;t<e;t++)try{return await o()}catch(i){if(r&&r(i,t+1),t===e-1)throw i}throw new Error("Retry failed")}
//# sourceMappingURL=timeout.js.map
