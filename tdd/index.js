import express from "express";
const app = express();

import { getTodos, getTodo } from "./todos.controllers.js";

app.route("/").get(getTodos);
app.route("/todos/:id").get(getTodo);

export default app;
