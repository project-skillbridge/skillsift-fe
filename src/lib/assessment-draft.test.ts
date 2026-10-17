import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearAssessmentDraft,
  deadlineIn,
  loadAssessmentDraft,
  saveAssessmentDraft,
  secondsUntil,
} from "./assessment-draft";

function stubStorage(overrides: Partial<Storage> = {}) {
  const data = new Map<string, string>();
  const storage = {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
    ...overrides,
  };
  vi.stubGlobal("window", { localStorage: storage });
}

const draft = {
  answers: { q1: "a", q2: ["x", "y"] },
  other: { q1: "free text" },
  index: 4,
  deadline: 1_900_000_000_000,
};

describe("assessment draft", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    stubStorage();
  });

  it("restores exactly what was saved after a reload", () => {
    saveAssessmentDraft("session-1", draft);
    expect(loadAssessmentDraft("session-1")).toEqual(draft);
  });

  it("keeps sessions separate so a new attempt never sees an old draft", () => {
    saveAssessmentDraft("session-1", draft);
    expect(loadAssessmentDraft("session-2")).toBeNull();
  });

  it("is removed once the assessment is submitted", () => {
    saveAssessmentDraft("session-1", draft);
    clearAssessmentDraft("session-1");
    expect(loadAssessmentDraft("session-1")).toBeNull();
  });

  it("returns null for a corrupt draft instead of throwing", () => {
    window.localStorage.setItem("skillsift-assessment-draft:s", "{not json");
    expect(loadAssessmentDraft("s")).toBeNull();
  });

  it("does not throw when storage is blocked", () => {
    stubStorage({
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => {
        throw new Error("blocked");
      },
    });
    expect(() => saveAssessmentDraft("s", draft)).not.toThrow();
    expect(loadAssessmentDraft("s")).toBeNull();
    expect(() => clearAssessmentDraft("s")).not.toThrow();
  });
});

describe("deadline helpers", () => {
  it("counts down to a stored deadline, so a reload resumes the clock", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-17T10:00:00Z"));
    const deadline = deadlineIn(30 * 60);

    vi.setSystemTime(new Date("2026-10-17T10:10:00Z"));
    expect(secondsUntil(deadline)).toBe(20 * 60);

    vi.setSystemTime(new Date("2026-10-17T10:45:00Z"));
    expect(secondsUntil(deadline)).toBe(0);
    vi.useRealTimers();
  });
});
