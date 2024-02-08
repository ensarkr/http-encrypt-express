import { createDecipheriv, createECDH } from "crypto";
import { postHandshakeReqT, postHandshakeResT } from "../../typings/requests";
import { doubleReturn } from "../../typings/global";
import { API_URL } from "../../envExtractor";

const testURL = API_URL + "/handshake";

describe("handshake", () => {
  test("shared private key works", async () => {
    const clientEcdh = createECDH("prime256v1");

    const res = await fetch(testURL, {
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

    const getRes = await fetch(API_URL, {
      method: "GET",
      headers: { "X-Client-ID": data.value.clientID },
    });

    const getData = await getRes.text();

    const [encryptedBody, initialVector] = getData.split(".");

    const decipher = createDecipheriv(
      "aes-256-cbc",
      sharedPrivateKeyBuffer,
      Buffer.from(initialVector, "hex")
    );

    let decryptedMessage = decipher.update(encryptedBody, "hex", "utf-8");
    decryptedMessage += decipher.final("utf-8");

    expect(JSON.parse(decryptedMessage)).toEqual({
      projectRepo: "https://github.com/ensarkr/http-encrypt-express",
      frontendOfThisProject: "https://github.com/ensarkr/http-encrypt-react",
      myGithub: "https://github.com/ensarkr",
      myEmail: "eyupensarkara@gmail.com",
    });
  });
});
