import { createECDH } from "crypto";
import { keyCache } from "../lib/KeyCache.js";
import { v4 as uuidV4 } from "uuid";
import { doubleReturn } from "../typings/global.js";

function createServerPublicKeyAndClientID(
  clientPublicKeyHex: string
): doubleReturn<{
  clientID: string;
  serverPublicKeyHex: string;
}> {
  try {
    const clientID = uuidV4();
    const server = createECDH("prime256v1");
    const serverPublicKeyHex = server.generateKeys("hex");

    const sharedPrivateKeyHex = server
      .computeSecret(Buffer.from(clientPublicKeyHex, "hex"))
      .toString("hex");

    keyCache.createItem({
      clientID,
      serverECDH: server,
      serverPublicKeyHex,
      clientPublicKeyHex,
      sharedPrivateKeyHex,
    });

    return { status: true, value: { clientID, serverPublicKeyHex } };
  } catch (error) {
    console.log(error);
    return { status: false, message: "Server crypto error occurred." };
  }
}

export { createServerPublicKeyAndClientID };
