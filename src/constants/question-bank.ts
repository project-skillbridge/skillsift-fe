/** Default countdown duration for timed assessments (seconds). */
export const ASSESSMENT_DEFAULT_DURATION_SECONDS = 30 * 60;

export const QUESTION_BANK = {
  meta: {
    product: "CredLane",
    document: "Candidate Onboarding Question Bank",
    version: "1.0",
    classification: "Internal Working Document — Not for distribution",
    total_questions: 48,
    required_questions: 37,
    optional_questions: 11,
  },
  sections: [
    {
      id: "section_1",
      title: "Professional Background",
      description:
        "Shown at sign-up. Establishes the candidate's career baseline. Feeds AI context payload.",
      questions: [
        {
          id: "q1",
          number: 1,
          question: "What is your current or most recent job title?",
          hint: "Used to anchor AI context before assessment begins.",
          input_type: "text",
          required: true,
          validation: {
            min_length: 1,
          },
          backend_notes: "String, min char enforced client-side",
        },
        {
          id: "q2",
          number: 2,
          question:
            "How many years of total professional experience do you have?",
          input_type: "single_pick",
          required: true,
          options: ["0–1 yr", "1–3 yrs", "3–5 yrs", "5–10 yrs", "10+ yrs"],
          backend_notes: "Enum, single value",
        },
        {
          id: "q3",
          number: 3,
          question: "Which industries or sectors have you worked in?",
          hint: "Selecting 'Other' reveals a free-text input inline.",
          input_type: "multi_pick",
          required: true,
          options: [
            "Fintech",
            "Healthcare",
            "E-commerce",
            "Government",
            "NGO",
            "Media & Entertainment",
            "Education",
            "Logistics",
            "Telecoms",
            "Oil & Gas",
            "Agriculture",
            "Other",
          ],
          conditional: {
            trigger_option: "Other",
            reveals: "free_text_input",
          },
          backend_notes: "Array of strings",
        },
        {
          id: "q4",
          number: 4,
          question: "What is the largest organisation you have worked for?",
          input_type: "single_pick",
          required: true,
          options: [
            "Solo / freelance",
            "2–10",
            "11–50",
            "51–200",
            "201–1,000",
            "1,000+",
          ],
          backend_notes: "Enum, single value",
        },
        {
          id: "q5",
          number: 5,
          question:
            "Have you worked at a startup, a large corporation, or both?",
          input_type: "multi_pick",
          required: true,
          options: [
            "Startup (<50)",
            "Mid-size",
            "Large corporation",
            "Government",
            "Freelance",
            "Self-employed",
          ],
          backend_notes: "Array of strings",
        },
        {
          id: "q6",
          number: 6,
          question: "What is your highest level of completed education?",
          hint: "Used for employer profile filtering.",
          input_type: "single_pick",
          required: true,
          options: [
            "Secondary",
            "Diploma",
            "Bachelor's",
            "Master's",
            "PhD",
            "Professional certification",
            "Self-taught",
            "Other",
          ],
          backend_notes: "Enum, single value",
        },
        {
          id: "q7",
          number: 7,
          question: "Are you currently a student or in active training?",
          hint: "Helps employers understand bandwidth and commitment level.",
          input_type: "single_pick",
          required: true,
          options: ["No", "Yes, part-time", "Yes, full-time"],
          backend_notes: "Enum, single value",
        },
        {
          id: "q8",
          number: 8,
          question: "In which country are you currently based?",
          hint: "Used for employer location filtering and timezone matching.",
          input_type: "text",
          required: true,
          validation: {
            min_length: 1,
          },
          backend_notes: "String, min char enforced client-side",
        },
        {
          id: "q9",
          number: 9,
          question: "Which city or region are you based in?",
          hint: "Used for granular location filtering on employer dashboard.",
          input_type: "text",
          required: true,
          validation: {
            min_length: 1,
          },
          backend_notes: "String, min char enforced client-side",
        },
        {
          id: "q10",
          number: 10,
          question:
            "What is your primary spoken language for professional work?",
          hint: "Employer filter for cross-border and international roles.",
          input_type: "single_pick",
          required: true,
          options: [
            "English",
            "French",
            "Arabic",
            "Portuguese",
            "Swahili",
            "Other",
          ],
          conditional: {
            trigger_option: "Other",
            reveals: "free_text_input",
          },
          backend_notes: "Enum, single value",
        },
      ],
    },
    {
      id: "section_2",
      title: "Skills & Expertise",
      description:
        "Collected at sign-up, refined dynamically after track selection. Drives assessment routing and Skill Evaluation calibration.",
      questions: [
        {
          id: "q11",
          number: 11,
          question: "Which skill track are you applying to be assessed on?",
          hint: "Drives assessment routing. Stored as track on candidate record.",
          input_type: "single_pick",
          required: true,
          options: [
            "Software Engineering",
            "Data & Analytics",
            "Product Management",
            "Design (UI/UX)",
            "Marketing",
            "Sales",
            "Customer Support",
            "Finance & Accounting",
            "HR & People Ops",
            "Content & Copywriting",
            "DevOps & Cloud",
            "Other",
          ],
          backend_notes: "Enum, single value",
        },
        {
          id: "q12",
          number: 12,
          question: "What is your specialization within your track?",
          hint: "Seeded per track. Drives Stage 2 Skill Evaluation calibration.",
          input_type: "single_pick",
          required: true,
          options: "dynamic — seeded per track selected in q11",
          backend_notes: "Enum, single value. Dynamic options per track.",
        },
        {
          id: "q13",
          number: 13,
          question:
            "How would you honestly rate yourself in your primary skill?",
          hint: "Claimed level. Compared against validated level after Skill Evaluation.",
          input_type: "single_pick",
          required: true,
          options: ["Entry", "Junior", "Mid", "Senior", "Expert"],
          backend_notes: "Enum, single value",
        },
        {
          id: "q14",
          number: 14,
          question: "Which tools or platforms do you use regularly?",
          hint: "Track-aware multi-select. Seeded per track. 'Other' opens free-text field.",
          input_type: "multi_pick",
          required: false,
          options: "dynamic — seeded per track selected in q11",
          conditional: {
            trigger_option: "Other",
            reveals: "free_text_input",
          },
          backend_notes: "Array of strings. Dynamic options per track.",
        },
        {
          id: "q15",
          number: 15,
          question:
            "How long have you been working with your primary tool or stack?",
          hint: "Depth signal fed to AI assessment engine.",
          input_type: "single_pick",
          required: true,
          options: [
            "Less than 6 months",
            "6–12 months",
            "1–2 years",
            "3–5 years",
            "5+ years",
          ],
          backend_notes: "Enum, single value",
        },
        {
          id: "q16",
          number: 16,
          question:
            "Have you ever trained, mentored, or taught others in your area?",
          input_type: "single_pick",
          required: true,
          options: ["Yes, formally", "Yes, informally", "No"],
          backend_notes: "Enum, single value",
        },
        {
          id: "q17",
          number: 17,
          question:
            "Have you contributed to or shipped a product, project, or deliverable independently?",
          hint: "Ownership signal. Used by AI to frame scenario complexity in assessment.",
          input_type: "single_pick",
          required: true,
          options: ["Yes, multiple times", "Yes, once", "Not yet"],
          backend_notes: "Enum, single value",
        },
        {
          id: "q18",
          number: 18,
          question:
            "Do you have any published work, portfolio, or public profile we can reference?",
          hint: "URL field. Optional. Displayed on verified profile if provided.",
          input_type: "text",
          required: false,
          validation: {
            format: "url",
          },
          backend_notes: "String, nullable",
        },
      ],
    },
    {
      id: "section_3",
      title: "Leadership & Responsibility",
      description:
        "Used to surface leadership tier on verified profile. Triggers advanced framing in assessment if relevant.",
      questions: [
        {
          id: "q19",
          number: 19,
          question: "Have you ever managed a direct team?",
          input_type: "single_pick",
          required: true,
          options: [
            "No",
            "Yes — 1 to 3 people",
            "Yes — 4 to 10 people",
            "Yes — 10+ people",
          ],
          backend_notes: "Enum, single value",
        },
        {
          id: "q20",
          number: 20,
          question: "Have you held any leadership title?",
          input_type: "multi_pick",
          required: true,
          options: [
            "Team lead",
            "Manager",
            "Senior manager",
            "Head of department",
            "Director",
            "VP or C-suite",
            "None of the above",
          ],
          backend_notes: "Array of strings",
        },
        {
          id: "q21",
          number: 21,
          question:
            "Describe a situation where you had to make a difficult decision that affected others at work.",
          hint: "Used by AI as leadership context for assessment framing.",
          input_type: "text",
          required: true,
          validation: {
            min_length: 80,
          },
          backend_notes: "String, min char enforced client-side",
        },
        {
          id: "q22",
          number: 22,
          question:
            "Have you ever led a project from start to finish without direct supervision?",
          input_type: "single_pick",
          required: true,
          options: ["Yes, multiple times", "Yes, once", "No"],
          backend_notes: "Enum, single value",
        },
        {
          id: "q23",
          number: 23,
          question: "Have you been responsible for hiring or building a team?",
          input_type: "single_pick",
          required: false,
          options: ["Yes", "No"],
          backend_notes: "Enum, single value",
        },
        {
          id: "q24",
          number: 24,
          question:
            "Have you ever managed a budget or been accountable for financial outcomes?",
          hint: "Leadership depth signal. Surfaces to employers on verified profile.",
          input_type: "single_pick",
          required: false,
          options: ["Yes, regularly", "Yes, once or twice", "No"],
          backend_notes: "Enum, single value",
        },
      ],
    },
    {
      id: "section_4",
      title: "International & Remote Experience",
      description:
        "Helps employers filter for candidates suited to distributed or cross-border roles.",
      questions: [
        {
          id: "q25",
          number: 25,
          question:
            "Have you ever worked with or for organisations outside your home country?",
          input_type: "single_pick",
          required: true,
          options: ["Yes, extensively", "Yes, occasionally", "No"],
          backend_notes: "Enum, single value",
        },
        {
          id: "q26",
          number: 26,
          question: "Have you worked in a fully remote or distributed team?",
          input_type: "single_pick",
          required: true,
          options: ["Yes, 2+ years", "Yes, less than 2 years", "No"],
          backend_notes: "Enum, single value",
        },
        {
          id: "q27",
          number: 27,
          question:
            "How many time zones have you actively collaborated across?",
          input_type: "single_pick",
          required: false,
          options: [
            "Same time zone only",
            "1–2 time zones",
            "3–5 time zones",
            "6+ time zones",
          ],
          backend_notes: "Enum, single value",
        },
        {
          id: "q28",
          number: 28,
          question:
            "Have you worked directly with international clients or stakeholders?",
          input_type: "single_pick",
          required: true,
          options: ["Yes, regularly", "Yes, occasionally", "No"],
          backend_notes: "Enum, single value",
        },
        {
          id: "q29",
          number: 29,
          question:
            "Are you open to roles that are fully remote, hybrid, or in-person?",
          input_type: "multi_pick",
          required: true,
          options: [
            "Fully remote",
            "Hybrid",
            "In-person only",
            "Flexible",
            "Open to any",
          ],
          backend_notes: "Array of strings",
        },
        {
          id: "q30",
          number: 30,
          question:
            "Do you have reliable internet access and a functional home workspace?",
          hint: "Practical signal for employers hiring remote workers in Africa.",
          input_type: "single_pick",
          required: true,
          options: ["Yes, fully set up", "Yes, mostly", "Working on it", "No"],
          backend_notes: "Enum, single value",
        },
      ],
    },
    {
      id: "section_5",
      title: "Work Style & Soft Skills",
      description:
        "Typed answers only. Used by AI to calibrate tone, scenario style, and pressure level in the assessment.",
      questions: [
        {
          id: "q31",
          number: 31,
          question:
            "How do you typically handle tight deadlines or sudden priority shifts?",
          hint: "Used by AI to calibrate scenario tone and pressure framing in assessment.",
          input_type: "text",
          required: true,
          validation: {
            min_length: 60,
          },
          backend_notes: "String, min char enforced client-side",
        },
        {
          id: "q32",
          number: 32,
          question:
            "Describe your ideal working environment — team dynamics, pace, structure.",
          hint: "Used by AI for soft-skills calibration.",
          input_type: "text",
          required: true,
          validation: {
            min_length: 60,
          },
          backend_notes: "String, min char enforced client-side",
        },
        {
          id: "q33",
          number: 33,
          question: "How do you prefer to receive feedback?",
          input_type: "single_pick",
          required: true,
          options: [
            "Directly and bluntly",
            "Bluntly but with context",
            "Gently with examples",
            "No preference",
          ],
          backend_notes: "Enum, single value",
        },
        {
          id: "q34",
          number: 34,
          question:
            "Have you ever had a significant professional disagreement? Briefly describe how you handled it.",
          hint: "Optional but used as soft-skills signal if provided.",
          input_type: "text",
          required: false,
          validation: {
            min_length_if_answered: 60,
          },
          backend_notes: "String, nullable",
        },
        {
          id: "q35",
          number: 35,
          question:
            "How do you typically manage your workload when juggling multiple responsibilities?",
          hint: "Captures prioritisation approach. Fed to AI context payload.",
          input_type: "text",
          required: true,
          validation: {
            min_length: 60,
          },
          backend_notes: "String, min char enforced client-side",
        },
        {
          id: "q36",
          number: 36,
          question:
            "Describe a time you had to learn something new quickly in a professional context.",
          hint: "Used to assess adaptability and self-direction.",
          input_type: "text",
          required: true,
          validation: {
            min_length: 60,
          },
          backend_notes: "String, min char enforced client-side",
        },
      ],
    },
    {
      id: "section_6",
      title: "Achievements & Evidence",
      description:
        "Used to populate the verified profile. Employers see this alongside assessment results.",
      questions: [
        {
          id: "q37",
          number: 37,
          question:
            "What is the single professional achievement you are most proud of and why?",
          hint: "Displayed on verified profile.",
          input_type: "text",
          required: true,
          validation: {
            min_length: 100,
          },
          backend_notes: "String, min char enforced client-side",
        },
        {
          id: "q38",
          number: 38,
          question:
            "Have you delivered work with a measurable business impact? Describe it briefly — include a number if possible.",
          hint: "e.g. 'Reduced onboarding time by 40%'. Strongly recommended. Displayed on verified profile.",
          input_type: "text",
          required: false,
          backend_notes: "String, nullable",
        },
        {
          id: "q39",
          number: 39,
          question:
            "Have you received any professional recognition, certifications, or promotions in the last 3 years?",
          hint: "If Yes, a follow-up text field is shown inline to describe.",
          input_type: "single_pick",
          required: true,
          options: ["Yes", "No"],
          conditional: {
            trigger_option: "Yes",
            reveals: "free_text_input",
          },
          backend_notes: "Enum, single value",
        },
        {
          id: "q40",
          number: 40,
          question:
            "Do you have any links to work you have shipped or contributed to publicly?",
          hint: "GitHub, Behance, live product, case study etc. Shown on verified profile.",
          input_type: "text",
          required: false,
          validation: {
            format: "url",
          },
          backend_notes: "String, nullable",
        },
        {
          id: "q41",
          number: 41,
          question:
            "Is there anything about your background or career path that you think is important context for employers?",
          hint: "Open field. Used by AI as final framing context. Also surfaced on verified profile.",
          input_type: "text",
          required: false,
          backend_notes: "String, nullable",
        },
      ],
    },
    {
      id: "section_7",
      title: "Availability & Intent",
      description:
        "Helps employers understand candidate status and match on practical constraints.",
      questions: [
        {
          id: "q42",
          number: 42,
          question: "What best describes your current job-search status?",
          input_type: "single_pick",
          required: true,
          options: [
            "Actively looking",
            "Open to the right opportunity",
            "Just exploring",
          ],
          backend_notes: "Enum, single value",
        },
        {
          id: "q43",
          number: 43,
          question: "What is your current availability?",
          input_type: "single_pick",
          required: true,
          options: [
            "Immediately available",
            "On notice (<1 month)",
            "On notice (1–3 months)",
            "Currently employed, flexible",
          ],
          backend_notes: "Enum, single value",
        },
        {
          id: "q44",
          number: 44,
          question: "What type of engagement are you open to?",
          input_type: "multi_pick",
          required: true,
          options: [
            "Full-time",
            "Part-time",
            "Contract",
            "Freelance",
            "Open to all",
          ],
          backend_notes: "Array of strings",
        },
        {
          id: "q45",
          number: 45,
          question: "What is your preferred work location?",
          hint: "City, country, or 'Remote'. Used for employer filtering.",
          input_type: "text",
          required: true,
          validation: {
            min_length: 1,
          },
          backend_notes: "String, min char enforced client-side",
        },
        {
          id: "q46",
          number: 46,
          question: "What is your salary or compensation expectation?",
          hint: "Directional signal only. Not binding. Surfaced to employer on match.",
          input_type: "single_pick",
          required: false,
          options: [
            "No preference",
            "Below market is fine for the right role",
            "Market rate",
            "Above market",
          ],
          backend_notes: "Enum, single value",
        },
        {
          id: "q47",
          number: 47,
          question: "What is your preferred currency for compensation?",
          hint: "Practical filter for cross-border hiring.",
          input_type: "single_pick",
          required: false,
          options: ["NGN", "USD", "GBP", "KES", "GHS", "ZAR", "EUR", "Other"],
          backend_notes: "Enum, single value",
        },
        {
          id: "q48",
          number: 48,
          question:
            "In your own words, what kind of next role or opportunity are you looking for?",
          hint: "Final question. Used as closing AI context payload for assessment personalisation.",
          input_type: "text",
          required: true,
          validation: {
            min_length: 80,
          },
          backend_notes: "String, min char enforced client-side",
        },
      ],
    },
  ],
} as const;

export type QuestionBankSection = (typeof QUESTION_BANK.sections)[number];

export const QUESTION_BANK_SECTIONS = QUESTION_BANK.sections.map(
  (section, index) => ({
    id: section.id,
    number: index + 1,
    title: section.title,
  }),
);

export type QuestionBankSectionId =
  (typeof QUESTION_BANK_SECTIONS)[number]["id"];

export const QUESTION_BANK_TOTAL_QUESTIONS = QUESTION_BANK.meta.total_questions;
