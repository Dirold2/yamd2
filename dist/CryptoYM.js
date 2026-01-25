"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptData = decryptData;
function hexStringToUint8Array(hexString) {
    if (!hexString || hexString.length % 2 !== 0) {
        throw new Error("Invalid hex string");
    }
    const hexPairs = hexString.match(/.{1,2}/g);
    if (!hexPairs) {
        throw new Error("Invalid hex string");
    }
    const byteValues = hexPairs.map((pair) => {
        const value = parseInt(pair, 16);
        if (Number.isNaN(value)) {
            throw new Error("Invalid hex string");
        }
        return value;
    });
    const arr = new Uint8Array(byteValues.length);
    arr.set(byteValues);
    return arr;
}
function numberToUint8Counter(num) {
    let value = BigInt(num);
    const counter = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
        counter[15 - i] = Number(value & BigInt(0xff));
        value = value >> BigInt(8);
    }
    return counter;
}
async function decryptData(params) {
    const { key, data, loadedBytes } = params;
    const keyBytes = hexStringToUint8Array(key);
    const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-CTR" }, false, ["encrypt", "decrypt"]);
    let counter = new Uint8Array(16);
    if (loadedBytes !== undefined) {
        const blockNumber = Math.floor(loadedBytes / 16);
        counter = numberToUint8Counter(blockNumber);
    }
    const decryptedData = await crypto.subtle.decrypt({
        name: "AES-CTR",
        counter: counter,
        length: 128
    }, cryptoKey, data);
    return decryptedData;
}
