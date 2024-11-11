import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { db } from "../database/db";

const verifyUserRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      res.status(401).json({ message: "unauthorized request" });
      return;
    }
    const tokenData = jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY as string
    ) as JwtPayload;
    const email = tokenData.email;
    const user = await db.users.findFirst({ where: { email } });
    if (!user) {
      res.status(401).send({ message: "unauthorized access" });
      return;
    }

    req.body.id = user?.id;
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Bad request" });
  }
};

export const authMiddleware = { verifyUserRequest };
