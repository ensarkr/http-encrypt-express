import { ECDH } from "crypto";

type ecdhDataT = {
  clientID: string;
  serverECDH: ECDH;
  serverPublicKeyHex: string;
  clientPublicKeyHex: string;
  sharedPrivateKeyHex: string;
};

export { ecdhDataT };
