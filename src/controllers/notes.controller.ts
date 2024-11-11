import { Request, Response } from "express";
import { db } from "../database/db";

export type NewNoteBody = {
  title: string;
  body: string;
};

export type EditNoteBody = {
  id: string;
  title: string;
  body: string;
};

const newNotesController = async (req: Request, res: Response) => {
  try {
    const { title, body } = req.body;
    const id = res.locals.id;
    await db.users.update({
      where: {
        id: id,
      },
      data: {
        notes: {
          create: {
            title: title,
            body: body,
            createdAt: new Date().toUTCString(),
          },
        },
      },
    });
    res.status(200).json({ message: "note added successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "unknown error" });
  }
};

const editNotesController = async (req: Request, res: Response) => {
  try {
    const { title, body, id } = req.body;
    const userId = res.locals.id;
    await db.users.update({
      where: {
        id: userId,
      },
      data: {
        notes: {
          update: {
            where: {
              id: id,
            },
            data: {
              title,
              body,
            },
          },
        },
      },
    });

    res.status(200).json({ message: "note updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "unknown error" });
  }
};

const deleteSingleNotesController = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.id;
    await db.users.delete({
      where: {
        id: userId,
      },
    });
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "unknown error" });
  }
};

const getAllNotesController = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.id;
    const user = await db.users.findUnique({
      where: { id: userId },
      include: { notes: true },
    });
    if (!user) {
      res.status(400).json({ message: "unauthorized request" });
    }
    res.status(200).json({
      message: "get notes success",
      data: {
        notes: user?.notes,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "unknown error" });
  }
};

export const notes = {
  newNotesController,
  editNotesController,
  deleteSingleNotesController,
  getAllNotesController,
};
