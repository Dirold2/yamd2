"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueManager = void 0;
class QueueManager {
    constructor(maxConcurrent = 50) {
        this.maxConcurrent = maxConcurrent;
        this.queue = [];
        this.running = 0;
    }
    async enqueue(executor) {
        if (this.running >= this.maxConcurrent) {
            await new Promise(resolve => this.queue.push(resolve));
        }
        this.running++;
        try {
            return await executor();
        }
        finally {
            this.running--;
            const next = this.queue.shift();
            if (next)
                next();
        }
    }
}
exports.QueueManager = QueueManager;
