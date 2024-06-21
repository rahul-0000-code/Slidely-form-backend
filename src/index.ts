import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {
  createSubmission,
  deleteSubmission,
  getAllSubmissionIds,
  getSubmissionById,
  getSubmissionsByEmail,
  updateSubmission,
} from "./controller";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get("/ping", (req: Request, res: Response) => {
  res.json({ success: true });
});

app.post("/submit", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createSubmission(req, res);
  } catch (error) {
    next(error); // Pass error to Express error handler
  }
});

app.get("/read/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getSubmissionById(req, res);
  } catch (error) {
    next(error);
  }
});

app.get("/list", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getAllSubmissionIds(req, res);
  } catch (error) {
    next(error);
  }
});

app.get("/submission/:email", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getSubmissionsByEmail(req, res);
  } catch (error) {
    next(error);
  }
});

app.delete("/submission/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteSubmission(req, res);
  } catch (error) {
    next(error);
  }
});

app.put("/submission/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateSubmission(req, res);
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
