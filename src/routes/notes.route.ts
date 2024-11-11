import { Router } from "express";
import { notes } from "../controllers/notes.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware.verifyUserRequest);

router.post("/notes/new", notes.newNotesController);

router.put("/notes/edit", notes.editNotesController);

router.delete("/notes/delete", notes.deleteSingleNotesController);

router.get("/notes/get/all", notes.getAllNotesController);

export const notesRouter = router;
