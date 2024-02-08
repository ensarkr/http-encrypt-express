import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { keyCache } from "../lib/KeyCache.js";
import { doubleReturn } from "../typings/global.js";

function encryptStringToHexAndIVHex(
  clientID: string,
  messageString: string
): doubleReturn<string> {
  const ecdh = keyCache.getItem(clientID);

  if (!ecdh.status) return ecdh;

  const initialVector = randomBytes(16);

  const cipher = createCipheriv(
    "aes-256-cbc",
    Buffer.from(ecdh.value.sharedPrivateKeyHex, "hex"),
    initialVector
  );

  let encryptedMessage = cipher.update(messageString, "utf-8", "hex");
  encryptedMessage += cipher.final("hex");

  return {
    status: true,
    value: encryptedMessage + "." + initialVector.toString("hex"),
  };
}

function decryptHexAndIVHex(
  clientID: string,
  encryptedHexAndIV: string
): doubleReturn<string> {
  const ecdh = keyCache.getItem(clientID);

  if (!ecdh.status) return ecdh;

  const [encryptedHex, initialVectorHex] = encryptedHexAndIV.split(".");

  const decipher = createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ecdh.value.sharedPrivateKeyHex, "hex"),
    Buffer.from(initialVectorHex, "hex")
  );

  let decryptedMessage = decipher.update(encryptedHex, "hex", "utf-8");
  decryptedMessage += decipher.final("utf-8");

  return {
    status: true,
    value: decryptedMessage,
  };
}

export { encryptStringToHexAndIVHex, decryptHexAndIVHex };
