"use strict";export class MusicHistoryApi{constructor(t){this.ctx=t}getMusicHistory(t=0,i=50){return this.ctx.getApiRaw("/music-history",{query:{page:String(t),pageSize:String(i)}})}}
//# sourceMappingURL=MusicHistoryApi.js.map
