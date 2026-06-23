"use strict";export class CreditApi{constructor(t){this.ctx=t}getTrackCredits(t){return this.ctx.get(this.ctx.createRequest(`/tracks/${t}/credits`))}getClipCredits(t){return this.ctx.get(this.ctx.createRequest(`/clips/${t}/credits`))}}
//# sourceMappingURL=CreditApi.js.map
