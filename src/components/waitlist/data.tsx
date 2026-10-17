type Step = {
  eyebrow: string;
  mobileTitle: string;
  desktopTitle: string;
  mobileBody: string;
  desktopBody: string;
  image: string;
  imageAlt: string;
};

const steps: Step[] = [
  {
    eyebrow: "What you know, proven on a timer",
    mobileTitle: "Skills-first Assessment",
    desktopTitle: "Complete Assessments",
    mobileBody:
      "A timed, role-specific test that proves you know your craft. Auto-graded the moment you submit.",
    desktopBody:
      "Candidates completes role-specific assessments, practical tasks and interviews.",
    image: "/waitlist-images/assessement.png",
    imageAlt: "Skills-first assessment illustration",
  },
  {
    eyebrow: "A profile employers can trust",
    mobileTitle: "Verified Talent Profile",
    desktopTitle: "Get Verified",
    mobileBody:
      "Once verified, your profile goes live with your score, tier, and track, all accessible to employers.",
    desktopBody:
      "SkillSift evaluates performance and assigns a standardized score.",
    image: "/waitlist-images/get-verified.png",
    imageAlt: "Verified talent profile card illustration",
  },
  {
    eyebrow: "The right opportunities find you",
    mobileTitle: "Employer Discovery Dashboard",
    desktopTitle: "Become Discoverable",
    mobileBody:
      "Hiring managers filter verified candidates by score, track and tier. Every profile they see is ready.",
    desktopBody: "Only job-ready candidate becomes visible to employers",
    image: "/waitlist-images/become-discoverable.png",
    imageAlt: "Employer discovery dashboard illustration",
  },
  {
    eyebrow: "A roadmap, rather than a rejection",
    mobileTitle: "AI Guidance Report",
    desktopTitle: "Connect Directly",
    mobileBody:
      "Didn't hit 75? You get a personalised AI report with your specific weak areas, and a 14-day retake window.",
    desktopBody:
      "Employers filter, discover, and contact verified talent without endless screening.",
    image: "/waitlist-images/connect-directly.png",
    imageAlt: "AI guidance report illustration",
  },
];

const footerLinks = [
  { label: "Terms of use", href: "terms-of-use" },
  { label: "Privacy Policy", href: "privacy-policy" },
];

const socials = [
  {
    src: "/waitlist-icons/tiktok.svg",
    alt: "TikTok",
    href: "https://tiktok.com/@credlanehq",
  },
  {
    src: "/waitlist-icons/x-fka.svg",
    alt: "X",
    href: "https://x.com/credlanehq",
  },
  {
    src: "/waitlist-icons/instagram.svg",
    alt: "Instagram",
    href: "https://instagram.com/credlanehq",
  },
  {
    src: "/waitlist-icons/facebook-icon.svg",
    alt: "Facebook",
    href: "https://facebook.com/credlanehq",
  },
  {
    src: "/waitlist-icons/linkedin.svg",
    alt: "LinkedIn",
    href: "https://linkedin.com/company/credlanehq",
  },
  {
    src: "/waitlist-icons/youtube.svg",
    alt: "YouTube",
    href: "https://youtube.com/@credlanehq",
  },
];

const roles = [
  "Founder",
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Product Designer",
  "Product Manager",
  "Data Scientist",
  "Other",
];

const sources = [
  "Facebook",
  "X (formerly Twitter)",
  "LinkedIn",
  "Instagram",
  "TikTok",
  "Friend",
  "Google search",
  "Other",
];

const desktopCopy: { skills: CardCopy; projects: CardCopy; talents: CardCopy } =
  {
    skills: {
      title: "Verified Talent",
      body: "Employers discover candidate based on proven skill - not CV claims.",
    },
    projects: {
      title: "Better Opportunity",
      body: "Candidates stand out with verified proof of ability.",
    },
    talents: {
      title: "Smarter Hiring",
      body: "Skip the guess work and connect faster with the right talent",
    },
  };

const mobileCopy: { skills: CardCopy; projects: CardCopy; talents: CardCopy } =
  {
    skills: {
      title: "Skills first – assessment",
      body: "A timed, role-specific test that proves you understand your craft.",
    },
    projects: {
      title: "Real-world projects",
      body: "Work on task relevant to your career track",
    },
    talents: {
      title: "Verified, Job ready talents",
      body: "Once verified, your profile goes live with your score, tier, and track.",
    },
  };
type CardCopy = { title: string; body: string };

export { steps, footerLinks, socials, roles, sources, desktopCopy, mobileCopy };
export type { CardCopy };
