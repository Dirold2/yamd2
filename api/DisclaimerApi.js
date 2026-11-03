"use strict";export class DisclaimerApi{constructor(i){this.ctx=i}getTrackDisclaimer(i){return this.ctx.getApi(`/tracks/${i}/disclaimer`)}getAlbumDisclaimer(i){return this.ctx.getApi(`/albums/${i}/disclaimer`)}getArtistDisclaimer(i){return this.ctx.getApi(`/artists/${i}/disclaimer`)}getClipDisclaimer(i){return this.ctx.getApi(`/clips/${i}/disclaimer`)}}
//# sourceMappingURL=DisclaimerApi.js.map
