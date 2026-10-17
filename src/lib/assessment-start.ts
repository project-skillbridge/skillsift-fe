import { ApiError } from "@/lib/api";

export const ASSESSMENT_PREPARING_TITLE = "Your next attempt isn't open yet";
export const ASSESSMENT_PREPARING_MESSAGE =
  "We'll notify you the moment you can retake this assessment.";

/** The API answers 503 ASSESSMENT_PREPARING when no unseen questions are left. */
export function isAssessmentPreparingError(error: unknown): boolean {
  if (!(error instanceof ApiError) || error.status !== 503) return false;
  const data = error.data;
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { error?: unknown }).error === "ASSESSMENT_PREPARING"
  );
}

export const ASSESSMENT_START_TIMEOUT_MS = 90_000;

export class AssessmentStartTimeoutError extends Error {
  constructor() {
    super("Assessment start timed out");
    this.name = "AssessmentStartTimeoutError";
  }
}

export function isAssessmentStartTimeoutError(
  error: unknown,
): error is AssessmentStartTimeoutError {
  return error instanceof AssessmentStartTimeoutError;
}

export function withAssessmentStartTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = ASSESSMENT_START_TIMEOUT_MS,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new AssessmentStartTimeoutError());
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export const ASSESSMENT_START_TIMEOUT_MESSAGE =
  "This is taking longer than expected. Please try again.";

export const ASSESSMENT_START_FAILED_MESSAGE =
  "Something went wrong while starting your assessment. Please try again.";
