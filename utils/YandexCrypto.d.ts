import { Readable, Transform } from "stream";
/**
 * Класс для расшифровки зашифрованных потоков Яндекс.Музыки
 */
export declare class YandexCryptoHelper {
    private key;
    constructor(key?: string);
    /**
     * Создает 16-байтовый счетчик для AES-CTR
     */
    private createCounter;
    /**
     * Расшифровывает данные используя AES-128-CTR
     */
    decryptData(ciphertext: Buffer, counter?: number): Buffer;
    /**
     * Создает Transform stream для расшифровки данных на лету
     */
    createDecryptStream(counter?: number): Transform;
    /**
     * Расшифровывает файл целиком
     */
    decryptFile(inputPath: string, outputPath: string, counter?: number): Promise<void>;
}
/**
 * Утилита для работы с зашифрованными URL Яндекс.Музыки
 */
export declare class YandexEncryptedStreamHandler {
    private crypto;
    constructor();
    /**
     * Извлекает параметр `kts` из URL (ключ/счетчик для расшифровки)
     */
    private extractKts;
    /**
     * Проверяет, является ли URL зашифрованным
     */
    isEncrypted(url: string): boolean;
    /**
     * Скачивает и расшифровывает поток
     */
    fetchAndDecrypt(url: string): Promise<Buffer>;
    /**
     * Создает расшифрованный stream из зашифрованного URL
     */
    createDecryptedStream(url: string): Promise<Readable>;
}
