import express from "express";
const router = express.Router();
export default router;

import {
  createFolder,
  getFolders,
  getFolderByIncludingFiles,
} from "#db/queries/folders";
import { createFile } from "#db/queries/files";

router.get("/", async (req, res) => {
  const folders = await getFolders();
  res.send(folders);
});

router.param("id", async (req, res, next, id) => {
  const folder = await getFolderByIncludingFiles(id);
  if (!folder) return res.status(404).send("Folder not found.");

  req.folder = folder;
  next();
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const folder = await getFolderByIncludingFiles(id);
  if (!folder) {
    return res.status(404).send("Folder not found.");
  }
  res.json(folder);
});

router.post("/:id/files", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required.");

  const { name, size } = req.body;
  if (!name || !size)
    return res.status(400).send("Request body must have: name, size");

  const folder_id = req.params.id;

  const file = await createFile({ name, size, folder_id });
  res.status(201).send(file);
});
