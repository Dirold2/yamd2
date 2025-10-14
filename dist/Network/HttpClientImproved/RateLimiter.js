"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
class RateLimiter {
    constructor(config) {
        var _a, _b;
        this.timestamps = [];
        this.max = (_a = config === null || config === void 0 ? void 0 : config.maxRequests) !== null && _a !== void 0 ? _a : 100;
        this.window = (_b = config === null || config === void 0 ? void 0 : config.windowMs) !== null && _b !== void 0 ? _b : 60000;
    }
    async wait() {
        const now = Date.now();
        this.timestamps = this.timestamps.filter((t) => now - t < this.window);
        if (this.timestamps.length >= this.max) {
            const delay = this.timestamps[0] + this.window - now;
            if (delay > 0)
                await new Promise((r) => setTimeout(r, delay));
        }
        this.timestamps.push(Date.now());
    }
}
exports.RateLimiter = RateLimiter;
