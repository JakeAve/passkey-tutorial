import {
  genRandomBytes,
  signWithHMAC,
  verifyWithHMAC,
} from "$lib/cryptoHelpers.ts";
import { getAccessTokenKey } from "$lib/getKey.ts";
import { dateToSeconds } from "$lib/secondsTimeStamp.ts";
import {
  base64UrlToUint8,
  bytesToBase64Str,
  bytesToBase64Url,
} from "$lib/encoding.ts";

const key = await getAccessTokenKey();

export interface JWT {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  nbf: number;
  sub: string;
  [key: string]: string | number;
}

export function createJWTPayload(payload: JWTOptions): JWT {
  const now = new Date();
  const iat = dateToSeconds(now);
  const { expiresIn, ...rest } = payload;
  const exp = iat + expiresIn;
  const nbf = iat;

  return {
    ...rest,
    iat,
    exp,
    nbf,
    jti: bytesToBase64Str(genRandomBytes(12)),
  };
}

export class JWTError extends Error {
  payload: JWT;
  constructor(payload: JWT, message = "Invalid JWT") {
    super(message);
    this.payload = payload;
  }
}

export function checkJWTPayload(payload: JWT) {
  const { exp, nbf } = payload;
  const now = dateToSeconds(new Date());

  if (nbf > now) {
    throw new JWTError(payload);
  }

  if (exp < now) {
    throw new JWTError(payload);
  }

  return true;
}

interface JWTOptions {
  sub: string;
  aud: string;
  iss: string;
  expiresIn: number;
  [key: string]: string | number;
}

export async function signJwt(jwtOptions: JWTOptions) {
  const encoder = new TextEncoder();

  const header = JSON.stringify({
    "alg": "HS256",
    "typ": "JWT",
  });

  const jwtPayload = createJWTPayload(jwtOptions);
  const payload = JSON.stringify(jwtPayload);

  const base64Header = bytesToBase64Url(encoder.encode(header));
  const base64Payload = bytesToBase64Url(encoder.encode(payload));
  const signature = await signWithHMAC(
    key,
    encoder.encode(base64Header + "." + base64Payload),
  );

  const base64Signature = bytesToBase64Url(new Uint8Array(signature));

  return `${base64Header}.${base64Payload}.${base64Signature}`;
}

export async function verifyJwt(token: string) {
  let payload: JWT = {
    aud: "",
    exp: 0,
    iat: 0,
    iss: "",
    jti: "",
    nbf: 0,
    sub: "",
  };
  try {
    const encoder = new TextEncoder();
    const [headerB64Url, payloadB64Url, signatureB64Url] = token.split(".");

    const data = `${headerB64Url}.${payloadB64Url}`;

    const signature = base64UrlToUint8(signatureB64Url);

    const isVerified = await verifyWithHMAC(
      key,
      signature,
      encoder.encode(data),
    );

    const payloadStr = new TextDecoder().decode(
      base64UrlToUint8(payloadB64Url),
    );

    payload = JSON.parse(payloadStr) as JWT;

    if (!isVerified) {
      throw new Error("crypto verify failed");
    }

    checkJWTPayload(payload);

    return payload;
  } catch {
    throw new JWTError(payload);
  }
}

export async function readJwt(token: string) {
  let payload: JWT = {
    aud: "",
    exp: 0,
    iat: 0,
    iss: "",
    jti: "",
    nbf: 0,
    sub: "",
  };
  let isValid = false;
  try {
    payload = await verifyJwt(token);
    isValid = true;
  } catch (err) {
    isValid = false;
    if (err instanceof JWTError) {
      payload = err.payload;
    } else throw err;
  }

  return { isValid, payload };
}
