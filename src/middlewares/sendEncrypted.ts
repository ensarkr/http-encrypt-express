import { Response } from "express";
import { encryptStringToHexAndIVHex } from "../functions/httpEncryption.js";

function sendEncrypted(
  res: Response,
  statusCode: number,
  JSONmessage: Record<string, unknown>
) {
  const encryptRes = encryptStringToHexAndIVHex(
    res.locals.auth.clientID,
    JSON.stringify(JSONmessage)
  );

  if (!encryptRes.status) return res.status(400).json(encryptRes).end();

  return res
    .status(statusCode)
    .setHeader("Content-Type", "text/html")
    .send(encryptRes.value)
    .end();
}

export { sendEncrypted };
