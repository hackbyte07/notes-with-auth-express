import { configDotenv } from "dotenv";
import Express from "express";
import { authRouter } from "./routes/auth.route";
import { notesRouter } from "./routes/notes.route";

const app = Express();
configDotenv();
app.use(Express.json());

app.get("/", (req, res) => {
  res.send({ message: "api is working" });
});

app.use(authRouter);
app.use(notesRouter);

app.listen(8080, "localhost", () => {
  console.log("app started");
});
