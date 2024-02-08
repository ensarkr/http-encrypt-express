import {
  createCipheriv,
  createDecipheriv,
  createECDH,
  randomBytes,
} from "crypto";
import { doubleReturn } from "../typings/global.js";
import { postHandshakeReqT, postHandshakeResT } from "../typings/requests.js";
import "dotenv/config";
import { client } from "../lib/DatabaseClient.js";
import { testUserData } from "./testDatas.js";
import { API_URL } from "../envExtractor.js";

async function keySetup_TEST() {
  const clientEcdh = createECDH("prime256v1");

  const res = await fetch(API_URL + "/handshake", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientPublicKey: clientEcdh.generateKeys("hex"),
    } as postHandshakeReqT),
  });

  const data = (await res.json()) as doubleReturn<postHandshakeResT>;

  if (!data.status) throw data.message;

  const sharedPrivateKeyBuffer = clientEcdh.computeSecret(
    Buffer.from(data.value.serverPublicKeyHex, "hex")
  );

  const encryptString = (string: string) => {
    const initialVector = randomBytes(16);

    const cipher = createCipheriv(
      "aes-256-cbc",
      sharedPrivateKeyBuffer,
      initialVector
    );

    let encryptedMessage = cipher.update(string, "utf-8", "hex");
    encryptedMessage += cipher.final("hex");

    return encryptedMessage + "." + initialVector.toString("hex");
  };

  const encrypt = (JSONmessage: Record<string, unknown>) => {
    const initialVector = randomBytes(16);

    const cipher = createCipheriv(
      "aes-256-cbc",
      sharedPrivateKeyBuffer,
      initialVector
    );

    let encryptedMessage = cipher.update(
      JSON.stringify(JSONmessage),
      "utf-8",
      "hex"
    );
    encryptedMessage += cipher.final("hex");

    return encryptedMessage + "." + initialVector.toString("hex");
  };

  const decrypt = (encryptedMessage: string) => {
    const [encryptedBody, initialVector] = encryptedMessage.split(".");

    const decipher = createDecipheriv(
      "aes-256-cbc",
      sharedPrivateKeyBuffer,
      Buffer.from(initialVector, "hex")
    );

    let decryptedMessage = decipher.update(encryptedBody, "hex", "utf-8");
    decryptedMessage += decipher.final("utf-8");

    return JSON.parse(decryptedMessage);
  };

  async function responseBodyConverter<T>(
    requestResponse: Response
  ): Promise<T & { wasResponseEncrypted: boolean }> {
    if (requestResponse.headers.get("content-type")?.includes("text/html")) {
      const decrypted = await decrypt(await requestResponse.text());

      return {
        ...decrypted,
        wasResponseEncrypted: true,
      } as T & {
        wasResponseEncrypted: boolean;
      };
    } else {
      return {
        ...(await requestResponse.json()),
        wasResponseEncrypted: false,
      } as T & {
        wasResponseEncrypted: boolean;
      };
    }
  }

  return {
    clientID: data.value.clientID,
    encrypt,
    encryptString,
    decrypt,
    responseBodyConverter,
  };
}

async function insertTestUser_TEST() {
  const res = await client.query<{ id: number }>(
    "INSERT INTO users (username, hashed_password) VALUES ($1,$2) RETURNING id",
    [testUserData.username, testUserData.hashedPassword]
  );

  await client.query(
    "INSERT INTO sessions (user_id, session_id) VALUES ($1,$2)",
    [res.rows[0].id, testUserData.sessionID]
  );
}

export { keySetup_TEST, insertTestUser_TEST };
