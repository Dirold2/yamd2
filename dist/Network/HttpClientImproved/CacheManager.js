"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
const lru_cache_1 = require("lru-cache");
class CacheManager {
    constructor(options) {
        var _a, _b;
        this.ttl = (_a = options === null || options === void 0 ? void 0 : options.cacheTTL) !== null && _a !== void 0 ? _a : 300000;
        this.cache = new lru_cache_1.LRUCache({
            max: (_b = options === null || options === void 0 ? void 0 : options.cacheMaxSize) !== null && _b !== void 0 ? _b : 500,
            ttl: this.ttl,
            updateAgeOnGet: true
        });
    }
    get(key) {
        var _a;
        return (_a = this.cache.get(key)) !== null && _a !== void 0 ? _a : null;
    }
    set(key, value) {
        this.cache.set(key, value);
    }
    clear() {
        this.cache.clear();
    }
}
exports.CacheManager = CacheManager;
