import type { AssessmentSubmission } from "@/types/api/employer-assessments";

export function formatDuration(seconds: number | null): string {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

export function candidateLabel(s: AssessmentSubmission): string {
  return s.candidateName || s.email || "Candidate";
}

export function percentileLabel(percentile: number | null): string {
  if (percentile == null) return "—";
  return percentile >= 100 ? "Beats all others" : `Beats ${percentile}%`;
}

/** Spreadsheet apps run cells that start with these as formulas. */
function csvCell(value: string | number | null): string {
  const text = value == null ? "" : String(value);
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function exportResultsCsv(
  title: string,
  rows: AssessmentSubmission[],
): void {
  const header = [
    "Rank",
    "Candidate",
    "Email",
    "Verified on SkillSift",
    "Score %",
    "Result",
    "Time taken",
    "Completed",
  ];
  const lines = rows.map((r) =>
    [
      r.rank,
      r.candidateName,
      r.email,
      r.source === "talent" ? "Yes" : "No",
      r.score,
      r.status === "pass" ? "Passed" : "Not passed",
      formatDuration(r.timeTakenSeconds),
      new Date(r.dateCompleted).toISOString(),
    ]
      .map(csvCell)
      .join(","),
  );
  const blob = new Blob(
    [[header.map(csvCell).join(","), ...lines].join("\n")],
    {
      type: "text/csv;charset=utf-8",
    },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^\w-]+/g, "-").toLowerCase()}-results.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
