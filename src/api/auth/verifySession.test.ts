import { insertTestUser_TEST, keySetup_TEST } from "../../tests/setup";
import { cleanup_TEST } from "../../tests/cleanup";
import { defaultBadResponseT } from "../../typings/requests";
import { API_URL } from "../../envExtractor";

const testURL = API_URL + "/auth/verifySession";

describe("verify session", () => {
  let setup: Awaited<ReturnType<typeof keySetup_TEST>>;

  beforeAll(async () => {
    setup = await keySetup_TEST();
    await insertTestUser_TEST();
  });

  afterAll(async () => {
    await cleanup_TEST(["deleteTestUser"]);
  });

  test("no client id", async () => {
    const res = await fetch(testURL, {
      method: "GET",
    });

    const data = await setup.responseBodyConverter<defaultBadResponseT>(res);

    expect(data).toEqual({
      status: false,
      message: "X-Client-ID header not found.",
      actions: ["resetKeyExchange"],
      wasResponseEncrypted: false,
    });
  });

  test("wrong session id", async () => {
    const res = await fetch(testURL, {
      method: "GET",
      headers: {
        "X-Client-ID": setup.clientID,
        Authorization: setup.encryptString("wrong session id"),
      },
    });

    const data = await setup.responseBodyConverter<defaultBadResponseT>(res);

    expect(data).toEqual({
      status: false,
      message: "Session ID is invalid.",
      actions: ["signOut"],
      wasResponseEncrypted: false,
    });
  });
});
