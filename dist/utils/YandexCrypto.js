"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YandexEncryptedStreamHandler = exports.YandexCryptoHelper = void 0;
const crypto_1 = __importDefault(require("crypto"));
const stream_1 = require("stream");
/**
 * Ключ для расшифровки потоков Яндекс.Музыки (encraw)
 */
const YANDEX_DECRYPT_KEY = "5869b72821cbd9f76afa0a58f7a94083";
/**
 * Класс для расшифровки зашифрованных потоков Яндекс.Музыки
 */
class YandexCryptoHelper {
    constructor(key = YANDEX_DECRYPT_KEY) {
        this.key = Buffer.from(key, "hex");
    }
    /**
     * Создает 16-байтовый счетчик для AES-CTR
     */
    createCounter(value) {
        const counter = Buffer.alloc(16);
        for (let i = 0; i < 16; i++) {
            counter[15 - i] = value & 0xff;
            value >>= 8;
        }
        return counter;
    }
    /**
     * Расшифровывает данные используя AES-128-CTR
     */
    decryptData(ciphertext, counter = 0) {
        const iv = this.createCounter(counter);
        const decipher = crypto_1.default.createDecipheriv("aes-128-ctr", this.key, iv);
        return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    }
    /**
     * Создает Transform stream для расшифровки данных на лету
     */
    createDecryptStream(counter = 0) {
        const iv = this.createCounter(counter);
        const decipher = crypto_1.default.createDecipheriv("aes-128-ctr", this.key, iv);
        return new stream_1.Transform({
            transform(chunk, encoding, callback) {
                try {
                    const decrypted = decipher.update(chunk);
                    callback(null, decrypted);
                }
                catch (err) {
                    callback(err);
                }
            },
            flush(callback) {
                try {
                    const final = decipher.final();
                    if (final.length > 0) {
                        callback(null, final);
                    }
                    else {
                        callback();
                    }
                }
                catch (err) {
                    callback(err);
                }
            }
        });
    }
    /**
     * Расшифровывает файл целиком
     */
    async decryptFile(inputPath, outputPath, counter = 0) {
        const fs = await import("fs/promises");
        const ciphertext = await fs.readFile(inputPath);
        const decrypted = this.decryptData(ciphertext, counter);
        await fs.writeFile(outputPath, decrypted);
    }
}
exports.YandexCryptoHelper = YandexCryptoHelper;
/**
 * Утилита для работы с зашифрованными URL Яндекс.Музыки
 */
class YandexEncryptedStreamHandler {
    constructor() {
        this.crypto = new YandexCryptoHelper();
    }
    /**
     * Извлекает параметр `kts` из URL (ключ/счетчик для расшифровки)
     */
    extractKts(url) {
        const match = url.match(/kts=([a-f0-9]+)/);
        if (!match)
            return 0;
        // Преобразуем hex в число
        return parseInt(match[1], 16);
    }
    /**
     * Проверяет, является ли URL зашифрованным
     */
    isEncrypted(url) {
        return url.includes("/music-v2/crypt/") && url.includes("kts=");
    }
    /**
     * Скачивает и расшифровывает поток
     */
    async fetchAndDecrypt(url) {
        const counter = this.extractKts(url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const encryptedData = Buffer.from(await response.arrayBuffer());
        return this.crypto.decryptData(encryptedData, counter);
    }
    /**
     * Создает расшифрованный stream из зашифрованного URL
     */
    async createDecryptedStream(url) {
        const counter = this.extractKts(url);
        const response = await fetch(url);
        if (!response.ok || !response.body) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        // Конвертируем ReadableStream в Node.js Readable
        const nodeStream = stream_1.Readable.fromWeb(response.body);
        const decryptStream = this.crypto.createDecryptStream(counter);
        return nodeStream.pipe(decryptStream);
    }
}
exports.YandexEncryptedStreamHandler = YandexEncryptedStreamHandler;
