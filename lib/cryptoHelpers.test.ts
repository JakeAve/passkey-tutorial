import {
  assert,
  assertEquals,
  assertNotEquals,
  assertThrows,
} from "$std/assert/mod.ts";
import {
  _32BitsToInteger,
  bytesToHexStr,
  decrypt,
  decryptSeconds,
  encrypt,
  encryptSeconds,
  genAESGCMKey,
  genRandomBytes,
  hexStrToUint8,
  integerTo32Bits,
} from "./cryptoHelpers.ts";

Deno.test("genRandomBytes() creates a random hex with default 256 bits", () => {
  const val = genRandomBytes();
  assertEquals(val.length, 32);
  assertNotEquals(val, genRandomBytes(32));
});

Deno.test("genAESGCMKey() key can encrypt", async () => {
  const message = "Alice is paranoid";
  const key = await genAESGCMKey();
  const iv = genRandomBytes(12);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(message),
  );
  assert(encrypted);
});

Deno.test("integerTo32Bits() works", () => {
  const val1 = integerTo32Bits(4000000000);
  assertEquals(val1, new Uint8Array([0, 40, 107, 238]));

  const val2 = integerTo32Bits(256);
  assertEquals(val2, new Uint8Array([0, 1, 0, 0]));

  const val3 = integerTo32Bits(0);
  assertEquals(val3, new Uint8Array([0, 0, 0, 0]));
});

Deno.test("integerTo32Bits() throws err outside of params", () => {
  assertThrows(
    () => integerTo32Bits(4294967296),
    "Must be between 0 and 4294967295",
  );
  assertThrows(() => integerTo32Bits(-1), "Must be between 0 and 4294967295");
});

Deno.test("_32BitsToInteger() works", () => {
  const val1 = _32BitsToInteger(new Uint8Array([0, 40, 107, 238]));
  assertEquals(val1, 4000000000);

  const val2 = _32BitsToInteger(new Uint8Array([0, 1, 0, 0]));
  assertEquals(val2, 256);

  const val3 = _32BitsToInteger(new Uint8Array([0, 0, 0, 0]));
  assertEquals(val3, 0);
});

Deno.test("encrypt() and decrypt() work", async () => {
  const key = await genAESGCMKey();

  const payload = "Alice is paranoid";

  const encrypted = await encrypt(key, payload);

  assertNotEquals(payload, encrypted);

  const decrypted = await decrypt(key, encrypted);

  assertEquals(new TextDecoder().decode(decrypted), payload);
});

Deno.test("encryptTimestamp() and decryptTimestamp()", async () => {
  const key = await genAESGCMKey();

  const d = new Date();
  const hexStr = await encryptSeconds(key, d);

  const seconds = await decryptSeconds(key, hexStr);

  assertEquals(seconds, Math.floor(d.getTime() / 1000));
});

Deno.test("hexStrToUint8()", () => {
  const hex =
    "643a79be2b605494c96224f75f18d563daa98fc5a33d4596b68d5838a47852f9";

  assertEquals(
    hexStrToUint8(hex),
    new Uint8Array([
      100,
      58,
      121,
      190,
      43,
      96,
      84,
      148,
      201,
      98,
      36,
      247,
      95,
      24,
      213,
      99,
      218,
      169,
      143,
      197,
      163,
      61,
      69,
      150,
      182,
      141,
      88,
      56,
      164,
      120,
      82,
      249,
    ]),
  );
});

Deno.test("bytesToHexStr()", () => {
  const hex = bytesToHexStr(
    new Uint8Array([
      100,
      58,
      121,
      190,
      43,
      96,
      84,
      148,
      201,
      98,
      36,
      247,
      95,
      24,
      213,
      99,
      218,
      169,
      143,
      197,
      163,
      61,
      69,
      150,
      182,
      141,
      88,
      56,
      164,
      120,
      82,
      249,
    ]),
  );

  assertEquals(
    hex,
    "643a79be2b605494c96224f75f18d563daa98fc5a33d4596b68d5838a47852f9",
  );
});
