// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import express, { Application, Request } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./graphql/index";
import { connectDatabase } from "./database";
import { Database, User } from "./lib/types";

export const authorizeRequest = async (
  db: Database,
  req: Request
): Promise<User | null> => {
  try {
    const token = req.get("X-CSRF-TOKEN");
    const viewer = await db.users.findOne({
      _id: req.signedCookies.viewer,
      token,
    });

    return viewer;
  } catch (err) {
    throw new Error(`authorization error ${err}`);
  }
};

const mount = async (app: Application) => {
  const db = await connectDatabase();

  app.use(bodyParser.json({ limit: "2mb" }));
  app.use(cookieParser(process.env.SECRET));
  app.use(compression());
  app.use(express.static(`${__dirname}/client`));
  app.get("/*", (_req, res) => res.sendFile(`${__dirname}/client/index.html`));
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });
  server.applyMiddleware({ app, path: "/api" });

  app.listen(process.env.PORT || 9000);
};

mount(express());
