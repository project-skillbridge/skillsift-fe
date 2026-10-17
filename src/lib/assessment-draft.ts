/**
 * Local draft of an in-progress assessment, so a refresh, crash or dropped
 * connection doesn't wipe the answers. Keyed by the server session id, so a
 * new attempt never picks up an old draft. Storage can be blocked, so every
 * access is guarded and a failure just means no draft.
 */
export type AssessmentDraft = {
  answers: Record<string, string | string[]>;
  other: Record<string, string>;
  index: number;
  /** Epoch ms when the countdown hits zero, for timers the server doesn't own. */
  deadline?: number;
};

const PREFIX = "skillsift-assessment-draft:";

export function loadAssessmentDraft(key: string): AssessmentDraft | null {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as AssessmentDraft) : null;
  } catch {
    return null;
  }
}

export function saveAssessmentDraft(key: string, draft: AssessmentDraft) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(draft));
  } catch {
    // Blocked or full storage: the assessment still works, just without resume.
  }
}

export function clearAssessmentDraft(key: string) {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // Nothing to clear.
  }
}

/** Epoch ms for a deadline `seconds` from now. */
export function deadlineIn(seconds: number): number {
  return Date.now() + seconds * 1000;
}

/** Whole seconds left until `deadline`, never negative. */
export function secondsUntil(deadline: number): number {
  return Math.max(0, Math.round((deadline - Date.now()) / 1000));
}
