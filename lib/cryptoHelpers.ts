import { dateToSeconds } from "./secondsTimeStamp.ts";

export function genRandomBytes(byteLength = 32) {
  const arr = new Uint8Array(byteLength);
  return crypto.getRandomValues(arr);
}

export function genAESGCMKey() {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
}

export function integerTo32Bits(n: number) {
  if (n < 0 || n > 4294967295) {
    throw new Error("Must be between 0 and 4294967295");
  }
  const byte1 = n & 0xff;
  const byte2 = (n >> 8) & 0xff;
  const byte3 = (n >> 16) & 0xff;
  const byte4 = (n >> 24) & 0xff;
  return new Uint8Array([byte1, byte2, byte3, byte4]);
}

export function _32BitsToInteger(bytes: Uint8Array) {
  if (bytes.length !== 4) {
    throw new Error("Must be Uint8Array length of 4");
  }
  const view = new DataView(bytes.buffer, 0);
  return view.getUint32(0, true);
}

export async function encrypt(key: CryptoKey, payload: string | BufferSource) {
  const iv = genRandomBytes(12);

  if (typeof payload === "string") {
    payload = new TextEncoder().encode(payload);
  }

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    payload,
  );

  const hex = Array.from(new Uint8Array([...iv, ...new Uint8Array(encrypted)]))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hex;
}

export function decrypt(key: CryptoKey, hex: string) {
  const arr = new Uint8Array(
    (hex.match(/.{1,2}/g) as RegExpMatchArray).map((h) => parseInt(h, 16)),
  );
  const iv = arr.slice(0, 12);
  const payload = arr.slice(12).buffer;

  return crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    payload,
  );
}

export function encryptSeconds(key: CryptoKey, date = new Date()) {
  const timestamp = integerTo32Bits(dateToSeconds(date));
  return encrypt(key, timestamp);
}

export async function decryptSeconds(key: CryptoKey, hex: string) {
  const arr = await decrypt(key, hex);
  return _32BitsToInteger(new Uint8Array(arr));
}
