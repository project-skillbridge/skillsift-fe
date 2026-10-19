import type { ResourceSection } from "@/types/resources";

/**
 * Role-independent reading for talents: interviews, working in a team and
 * growing a career. Free, public pages (checked to load when added).
 */
export const CAREER_RESOURCE_SECTIONS: ResourceSection[] = [
  {
    id: "career-interviews",
    title: "Interview preparation",
    type: "article",
    items: [
      {
        url: "https://www.techinterviewhandbook.org/software-engineering-interview-guide/",
        title: "The software engineering interview process",
        description:
          "What each interview round looks for and how to plan your preparation.",
        duration: "15 min read",
      },
      {
        url: "https://www.techinterviewhandbook.org/behavioral-interview/",
        title: "Answering behavioural questions",
        description:
          "How to structure stories about teamwork, conflict and mistakes.",
        duration: "20 min read",
      },
      {
        url: "https://grow.google/certificates/interview-warmup/",
        title: "Interview Warmup",
        description:
          "Practise answering common questions out loud and get feedback.",
        duration: "10 min practice",
      },
      {
        url: "https://www.techinterviewhandbook.org/resume/",
        title: "Writing a resume that gets read",
        description:
          "What to include, what to cut and how to word your impact.",
        duration: "15 min read",
      },
      {
        url: "https://www.techinterviewhandbook.org/negotiation/",
        title: "Negotiating an offer",
        description: "How to weigh an offer and ask for more without friction.",
        duration: "15 min read",
      },
    ],
  },
  {
    id: "career-teamwork",
    title: "Working well with a team",
    type: "article",
    items: [
      {
        url: "https://rework.withgoogle.com/en/guides/understanding-team-effectiveness",
        title: "What makes a team effective",
        description:
          "Research on trust, clear roles and psychological safety in teams.",
        duration: "10 min read",
      },
      {
        url: "https://google.github.io/eng-practices/review/",
        title: "How code review works",
        description:
          "What reviewers look for and how to give and take feedback well.",
        duration: "15 min read",
      },
      {
        url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests",
        title: "Collaborating through pull requests",
        description: "How teams propose, discuss and merge changes together.",
        duration: "10 min read",
      },
      {
        url: "https://www.atlassian.com/team-playbook",
        title: "The Team Playbook",
        description:
          "Short exercises teams use to plan, run meetings and resolve problems.",
        duration: "Browse",
      },
    ],
  },
  {
    id: "career-growth",
    title: "Grow beyond the job hunt",
    type: "article",
    items: [
      {
        url: "https://jvns.ca/blog/good-questions/",
        title: "How to ask good questions",
        description:
          "Get unstuck faster and make a good impression on new teammates.",
        duration: "10 min read",
      },
      {
        url: "https://developers.google.com/tech-writing",
        title: "Technical writing courses",
        description:
          "Write clear emails, docs and messages, a skill every team values.",
        duration: "Self-paced",
      },
      {
        url: "https://www.kalzumeus.com/2012/01/23/salary-negotiation/",
        title: "Salary negotiation for engineers",
        description:
          "A practical guide to talking about pay, from offer to raise.",
        duration: "30 min read",
      },
    ],
  },
  {
    id: "career-videos",
    title: "Career videos",
    type: "video",
    items: [
      {
        url: "https://www.youtube.com/watch?v=6U5MgJT9auo",
        title: "Prepare for a behavioural interview (STAR method)",
        duration: "Video",
      },
      {
        url: "https://www.youtube.com/watch?v=ktUHzfvCNs8",
        title: "Software engineer behavioural questions and answers",
        duration: "Video",
      },
      {
        url: "https://www.youtube.com/watch?v=d9_fweNDjKw",
        title: "Better code reviews in 6 simple steps",
        duration: "Video",
      },
      {
        url: "https://www.youtube.com/watch?v=LhoLuui9gX8",
        title: "Building a psychologically safe workplace",
        duration: "Video",
      },
      {
        url: "https://www.youtube.com/watch?v=cMaY8LLo91E",
        title: "How to negotiate a job offer",
        duration: "Video",
      },
    ],
  },
];
