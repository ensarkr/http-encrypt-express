import express from "express";
import { handshake } from "./handshake/handshake.js";
import cors from "cors";
import { roleProcess_HOMW } from "../middlewares/roleProcess.js";
import { auth } from "./auth/auth.js";
import { sendEncrypted } from "../middlewares/sendEncrypted.js";
import { API_URL } from "../envExtractor.js";
import { data } from "./data/data.js";
import { artificialLag_MW } from "../middlewares/artificialLag.js";

const app = express();

app.use(cors({ origin: "*", credentials: true }));

app.use(express.text({ type: "text/html" }));
app.use(express.json({ type: "application/json" }));

app.use(artificialLag_MW);
app.use(auth);
app.use(handshake);
app.use(data);

app.get("/", roleProcess_HOMW("guest"), (req, res) => {
  sendEncrypted(res, 200, {
    projectRepo: "https://github.com/ensarkr/http-encrypt-express",
    frontendOfThisProject: "https://github.com/ensarkr/http-encrypt-react",
    myGithub: "https://github.com/ensarkr",
    myEmail: "eyupensarkara@gmail.com",
  });
});

const port = 5000;

app.listen(port, () => {
  console.log("http-encrypt-express listening on " + API_URL);
});
