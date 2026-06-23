"use strict";export class QueueApi{constructor(e){this.ctx=e}getQueues(){return this.ctx.get(this.ctx.createRequest("/queues").addHeaders(this.ctx.deviceHeader))}getQueue(e){return this.ctx.get(this.ctx.createRequest(`/queues/${e}`))}}
//# sourceMappingURL=QueueApi.js.map
