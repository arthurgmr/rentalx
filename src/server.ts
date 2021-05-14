import express from "express";

import { cetegoriesRoutes } from "./routes/categories.routes";

const app = express();

app.use(express.json());

app.use("/categories", cetegoriesRoutes);

app.get("/", (request, response) => {
  return response.json({ message: "Hello world!" });
});

app.listen(3333, () => console.log("Server is running!"));