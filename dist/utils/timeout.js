"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTimeout = withTimeout;
exports.withRetry = withRetry;
async function withTimeout(promise, timeoutMs, errorMessage = "Request timed out") {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error(errorMessage)), timeoutMs));
    return Promise.race([promise, timeoutPromise]);
}
async function withRetry(fn, retries, onError) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        }
        catch (error) {
            if (onError)
                onError(error, i + 1);
            if (i === retries - 1)
                throw error;
        }
    }
    throw new Error("Retry failed");
}
