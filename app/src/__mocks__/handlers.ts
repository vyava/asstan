import { rest } from "msw";
// import users from "data/users"; // contains mock data for users
import data from "./bayiData.json";
// import messages from "data/messages";// contains mock data for messages

export const handlers = [
  rest.get("http://localhost:3000/api/bayiler", (req, res, ctx) => {
    return res(ctx.json(data));
  }),

  rest.get("/api/bayiler/:id", (req, res, ctx) => {
    return res(ctx.json([]));
  }),
];
