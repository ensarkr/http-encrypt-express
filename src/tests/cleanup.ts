import { client } from "../lib/DatabaseClient.js";
import { testUserData } from "./testDatas.js";

async function cleanup_TEST(tasks: "deleteTestUser"[]) {
  if (tasks.includes("deleteTestUser"))
    await client.query("DELETE FROM users WHERE username = $1", [
      testUserData.username,
    ]);

  await client.end();
}

export { cleanup_TEST };
