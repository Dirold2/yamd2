"use strict";export class AccountApi{constructor(t){this.ctx=t}getAccountStatus(){return this.ctx.get(this.ctx.createRequest("/account/status"))}getFeed(){return this.ctx.get(this.ctx.createRequest("/feed"))}}
//# sourceMappingURL=AccountApi.js.map
