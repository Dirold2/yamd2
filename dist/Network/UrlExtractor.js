"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UrlExtractor {
    extractGroups(url, regex, entityName, groupNames) {
        var _a;
        const match = (_a = url.match(regex)) === null || _a === void 0 ? void 0 : _a.groups;
        if (!match) {
            throw new Error(`Invalid ${entityName} URL: ${url}`);
        }
        return groupNames.reduce((acc, name) => {
            const value = match[name];
            if (!value) {
                throw new Error(`Missing ${name} in ${entityName} URL: ${url}`);
            }
            acc[name] = value;
            return acc;
        }, {});
    }
    extractTrackId(url) {
        var _a;
        // Direct short track URL: /track/<id>
        const direct = url.match(/(?:https?:\/\/)?music\.yandex\.ru\/track\/(?<id>\d+)/);
        if ((_a = direct === null || direct === void 0 ? void 0 : direct.groups) === null || _a === void 0 ? void 0 : _a.id)
            return Number(direct.groups.id);
        // Album track URL: /album/<albumId>/track/<id>
        const extracted = this.extractGroups(url, /(?:https?:\/\/)?music\.yandex\.ru\/album\/\d+\/track\/(?<id>\d+)/, "track", ["id"]);
        return Number(extracted.id);
    }
    extractAlbumId(url) {
        const extracted = this.extractGroups(url, /(?:https?:\/\/)?music\.yandex\.ru\/album\/(?<id>\d+)/, "album", ["id"]);
        return Number(extracted.id);
    }
    extractArtistId(url) {
        const extracted = this.extractGroups(url, /(?:https?:\/\/)?music\.yandex\.ru\/artist\/(?<id>\d+)/, "artist", ["id"]);
        return Number(extracted.id);
    }
    extractPlaylistId(url) {
        // User-based playlist URL: /users/<user>/playlists/<id>
        if (url.includes("/users/") && url.includes("/playlists/")) {
            const extracted = this.extractGroups(url, /(?:https?:\/\/)?music\.yandex\.ru\/users\/(?<user>[\w\d\-_\.]+)\/playlists\/(?<id>\d+)/, "playlist", ["id", "user"]);
            return { id: Number(extracted.id), user: extracted.user };
        }
        // Public/UUID-style playlist URL: /playlists/<uid> or /playlist/<uid>
        if (url.includes("/playlists/") || url.includes("/playlist/")) {
            const extracted = this.extractGroups(url, /(?:https?:\/\/)?music\.yandex\.ru\/playlists?\/(?<uid>(?:ar\.)?[A-Za-z0-9\-]+)/, "playlist", ["uid"]);
            return { id: extracted.uid, user: null };
        }
        throw new Error(`Invalid playlist URL: ${url}`);
    }
}
exports.default = UrlExtractor;
