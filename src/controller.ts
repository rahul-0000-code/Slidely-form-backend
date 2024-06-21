import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const DB_FILE = path.resolve(__dirname, "../data.json");

interface Submission {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  githubLink: string;
  stopwatchTime: string;
}

const readSubmissionsFromFile = (): Submission[] => {
  const data = fs.readFileSync(DB_FILE, "utf8");
  return JSON.parse(data) as Submission[];
};

const writeSubmissionsToFile = (submissions: Submission[]): void => {
  fs.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));
};

export async function createSubmission(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, email, phoneNumber, githubLink, stopwatchTime } = req.body;

    const newSubmission: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      phoneNumber,
      githubLink,
      stopwatchTime,
    };

    const submissions = readSubmissionsFromFile();
    submissions.push(newSubmission);
    writeSubmissionsToFile(submissions);

    res.status(201).json({
      message: "Submission created successfully",
      submission: newSubmission,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create submission", error: error.message });
  }
}

export async function getAllSubmissionIds(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const submissionIds = readSubmissionsFromFile().map((submission) => submission.id);
    res.status(200).json(submissionIds);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to retrieve submission IDs",
      error: error.message,
    });
  }
}

export async function getSubmissionById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const submission = readSubmissionsFromFile().find((s) => s.id === id);

    if (!submission) {
      res.status(404).json({ message: "Submission not found" });
      return;
    }

    res.status(200).json(submission);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to retrieve submission",
      error: error.message,
    });
  }
}

export async function deleteSubmission(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    let submissions = readSubmissionsFromFile();

    submissions = submissions.filter((submission) => submission.id !== id);

    writeSubmissionsToFile(submissions);

    res.status(200).json({ message: "Submission deleted successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to delete submission",
      error: error.message,
    });
  }
}

export async function updateSubmission(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    let submissions = readSubmissionsFromFile();

    const index = submissions.findIndex((submission) => submission.id === id);
    if (index === -1) {
      res.status(404).json({ message: "Submission not found" });
      return;
    }

    submissions[index] = { ...submissions[index], ...updatedFields };

    writeSubmissionsToFile(submissions);

    res.status(200).json(submissions[index]);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to update submission",
      error: error.message,
    });
  }
}

export async function getSubmissionsByEmail(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email } = req.params;

    const filteredSubmissions = readSubmissionsFromFile().filter(
      (submission) => submission.email === email
    );

    res.status(200).json(filteredSubmissions);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to retrieve submissions by email",
      error: error.message,
    });
  }
}
