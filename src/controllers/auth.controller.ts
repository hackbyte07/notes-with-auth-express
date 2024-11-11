import { NextFunction, Request, Response } from "express";
import { db } from "../database/db";
import bscrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";

export type LoginUserBody = {
  email: string;
  password: string;
};

export type SignupUserBody = {
  name: string;
  email: string;
  password: string;
};

const userLoginController = async (
  req: Request<{}, {}, LoginUserBody>,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    const user = await db.users.findFirst({ where: { email: email } });
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }
    const validUser = await bscrypt.compare(password, user?.password as string);
    if (!validUser) {
      res.status(401).json({ message: "unauthorized access" });
    }
    const token = jwt.sign({ email }, process.env.JWT_PRIVATE_KEY as string, {
      expiresIn: "24h",
    });
    res.status(200).json({
      message: "user login successful",
      data: {
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "bad request" });
  }
};

const userSignupController = async (
  req: Request<{}, {}, SignupUserBody>,
  res: Response
) => {
  try {
    const { email, password, name } = req.body;
    const user = await db.users.findFirst({ where: { email: email } });
    if (user) {
      res.status(400).json({ message: "user exists please login" });
    }
    const hashedPassword = await bscrypt.hash(password, 10);
    await db.users.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "bad request" });
  }
};

export const auth = {
  userLoginController,
  userSignupController,
};
