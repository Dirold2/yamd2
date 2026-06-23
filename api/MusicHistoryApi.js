"use strict";export class MusicHistoryApi{constructor(t){this.ctx=t}getMusicHistory(t=0,i=50){return this.ctx.getRaw(this.ctx.createRequest("/music-history").addQuery({page:String(t),pageSize:String(i)}))}}
//# sourceMappingURL=MusicHistoryApi.js.map
