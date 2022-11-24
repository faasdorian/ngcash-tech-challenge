import { Router } from "express";

const router = Router();

router.all("*", (req, res) => {
  res.status(404).send("Not found");
});

export default router;
