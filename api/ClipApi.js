"use strict";export class ClipApi{constructor(t){this.ctx=t}getClips(t){return this.ctx.get(this.ctx.createRequest("/clips").addQuery({clipIds:t.join(",")}))}getClipsWillLike(t=0,e=50){return this.ctx.get(this.ctx.createRequest("/clips/will/like").addQuery({page:String(t),pageSize:String(e)}))}}
//# sourceMappingURL=ClipApi.js.map
