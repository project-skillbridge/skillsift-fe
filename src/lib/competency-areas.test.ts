import { describe, expect, it } from "vitest";

import {
  competencyArea,
  formatCompetency,
  groupCompetencies,
} from "./competency-areas";

describe("formatCompetency", () => {
  it("upper-cases known acronyms and sentence-cases the rest", () => {
    expect(formatCompetency("css_architecture")).toBe("CSS architecture");
    expect(formatCompetency("http_api")).toBe("HTTP API");
    expect(formatCompetency("web_performance")).toBe("Web performance");
  });
});

describe("groupCompetencies", () => {
  it("rolls narrow competencies into areas, weakest first", () => {
    const grouped = groupCompetencies([
      { competency: "react_state", correct: 1, total: 1, percentage: 100 },
      { competency: "react_effects", correct: 0, total: 1, percentage: 0 },
      { competency: "css_layout", correct: 1, total: 1, percentage: 100 },
    ]);
    expect(grouped).toEqual([
      { competency: "React", correct: 1, total: 2, percentage: 50 },
      { competency: "HTML and CSS", correct: 1, total: 1, percentage: 100 },
    ]);
  });

  it("keeps unknown competencies as their own readable row", () => {
    expect(competencyArea("kubernetes_ops")).toBe("Kubernetes ops");
  });
});
