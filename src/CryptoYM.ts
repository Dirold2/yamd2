function hexStringToUint8Array(hexString: string): Uint8Array<ArrayBuffer> {
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

  const arr = new Uint8Array(byteValues.length) as Uint8Array<ArrayBuffer>;
  arr.set(byteValues);
  return arr;
}

function numberToUint8Counter(num: number): Uint8Array<ArrayBuffer> {
  let value = BigInt(num);
  const counter = new Uint8Array(16) as Uint8Array<ArrayBuffer>;

  for (let i = 0; i < 16; i++) {
    counter[15 - i] = Number(value & BigInt(0xff));
    value = value >> BigInt(8);
  }

  return counter;
}

export async function decryptData(params: {
  key: string;
  data: ArrayBuffer;
  loadedBytes?: number;
}): Promise<ArrayBuffer> {
  const { key, data, loadedBytes } = params;

  const keyBytes = hexStringToUint8Array(key);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes as any,
    { name: "AES-CTR" },
    false,
    ["encrypt", "decrypt"]
  );

  let counter: Uint8Array<ArrayBuffer> = new Uint8Array(
    16
  ) as Uint8Array<ArrayBuffer>;

  if (loadedBytes !== undefined) {
    const blockNumber = Math.floor(loadedBytes / 16);
    counter = numberToUint8Counter(blockNumber);
  }

  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-CTR",
      counter: counter as any,
      length: 128
    },
    cryptoKey,
    data as any
  );

  return decryptedData;
}
