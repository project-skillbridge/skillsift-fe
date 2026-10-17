import type { ProcessCardStep } from "@/types/process-card";

export const processSteps = [
  {
    id: "assessments",
    title: "Complete Assessments",
    description:
      "Complete role-specific assessments designed to evaluate real world skills and job readiness accurately.",
    img: "/assets/skill-assessments-preview-1.svg",
    accent: "#A5C8D8",
    featured: true,
  },
  {
    id: "verification",
    title: "Get Verified",
    description:
      "Receive an employability score that reflects your actual performance across all assessment stages.",
    img: "/assets/skill-assessments-preview-2.svg",
    accent: "#CBB0EB",
    featured: false,
  },
  {
    id: "discovered",
    title: "Get Discovered",
    description:
      "Become visible to employers actively looking for verified talent for relevant roles and opportunities.",
    img: "/assets/skill-assessments-preview-3.svg",
    accent: "#E29A4D",
    featured: false,
  },
] as const satisfies readonly ProcessCardStep[];

export const featureCards = [
  {
    name: "Clement Bassey",
    role: "Frontend",
    rating: 4.7,
    description:
      "The hiring process feels transparent and merit-based. The assessments allowed me to showcase my actual skills, and I received interview opportunities that matched my experience level.",
    accent: "#A5C8D8",
    img: "/assets/skill_assessments.svg",
  },
  {
    name: "Lisa Davis",
    role: "Recruiter",
    rating: 4.9,
    description:
      "This platform significantly reduced the time we spent screening candidates. The assessment results helped us quickly identify qualified applicants and focus on meaningful interviews.",
    accent: "#CBB0EB",
    img: "/assets/verified_scoring.svg",
  },
  {
    name: "Amaka Charles",
    role: "Product Designer",
    rating: 4.8,
    description:
      "I've used several job platforms before, but SkillSift stood out because employers could see my verified skills rather than just my resume. I landed a role within a few weeks of joining.",
    accent: "#A5C8D8",
    img: "/assets/personalized_guidance.svg",
  },
  {
    name: "Micheal Bubble",
    role: "Founder",
    rating: 4.7,
    description:
      "The quality of candidates we received through SkillSift exceeded our expectations. Having access to skill-based evaluations gave us more confidence in our hiring decisions.",
    accent: "#CBB0EB",
    img: "/assets/verified_profile.svg",
  },
];

export const faqs = [
  {
    q: "What is SkillSift?",
    a: "SkillSift is a career growth platform that helps you learn the right skills, prove your work with verified data, and get discovered by employers.",
  },
  {
    q: "How does SkillSift verify talent?",
    a: "SkillSift verifies talent through completed work, skill signals, and profile data that helps employers understand readiness.",
  },
  {
    q: "Is SkillSift free for candidates?",
    a: "Candidates can create a profile and start building proof of skill on SkillSift.",
  },
  {
    q: "Who can use SkillSift?",
    a: "SkillSift is for candidates building career proof and employers looking for credible, job-ready talent.",
  },
  {
    q: "What happens if I'm not job-ready yet?",
    a: "You can keep learning, improving your profile, and building verified proof until you are ready for opportunities.",
  },
];

export const talentList = [
  { name: "Anita Mensah", role: "Virtual Assistant" },
  { name: "Joy Kins", role: "Digital Marketer" },
  { name: "Peace John", role: "Product Manager" },
  { name: "Jason Reed", role: "DevOps" },
  { name: "Ruth Chukwu", role: "Product Designer" },
  { name: "Teo Brown", role: "Frontend Dev" },
];

export const avatarColors = [
  "bg-violet-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-teal-500",
];

export const hiringSteps = [
  {
    id: "access-talent",
    title: "Access Verified Talent",
    description:
      "Browse candidates who have already completed SkillSift's assessment and verification process.",
    img: "/assets/hiring-preview-1.svg",
    accent: "#CBEAFE",
    featured: false,
  },
  {
    id: "screen-faster",
    title: "Screen Faster",
    description:
      "Use standardized employability scores to compare candidates and shortlist more efficiently.",
    img: "/assets/hiring-preview-2.svg",
    accent: "#CBEAFE",
    featured: false,
  },
  {
    id: "assess-further",
    title: "Assess Further",
    description:
      "Create optional additional assessments for shortlisted candidates before making a final hiring decision.",
    img: "/assets/hiring-preview-3.svg",
    accent: "#CBEAFE",
    featured: true,
  },
] as const satisfies readonly ProcessCardStep[];
