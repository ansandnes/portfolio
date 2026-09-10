// English is the source of truth for the message shape. `no.ts` must satisfy
// `Messages`, so a missing key is a compile error.

export const en = {
  nav: {
    brand: "Portfolio",
    home: "Home",
    resume: "CV - Resume",
    experience: "Experience",
    testimonials: "Testimonials",
    projects: "Projects",
    menuToggle: "Toggle navigation menu",
  },
  topbar: {
    languageLabel: "Language",
    english: "English",
    norwegian: "Norsk",
    toDark: "Switch to dark mode",
    toLight: "Switch to light mode",
  },
  home: {
    greetingLead: "Hi, I'm ",
    greetingTail: ". Welcome to my website!",
    intro:
      "I'm an aspiring software engineer with a passion for building tools that solve real problems. This portfolio is your gateway into my work, journey, and experiences.",
    tagline: "Built with technical curiosity.",
    ctaProjects: "Explore My Apps",
    ctaResume: "View My Resume",
    ctaTestimonials: "What People Say",
  },
  experience: {
    title: "Professional Journey",
  },
  testimonials: {
    titleLead: "What People",
    titleAccent: "Say",
    subtitle:
      "Feedback from colleagues, managers, and clients I've had the pleasure of working with.",
    at: "at",
  },
  projects: {
    title: "Mini Applications",
    subtitle: "Interactive demonstrations of my projects.",
    tablist: "Mini apps",
    tabs: {
      todo: "Todo List",
      recipe: "Chef Assistant",
      chat: "AI Chat",
      energy: "Energy Analyzer",
    },
  },
  footer: {
    builtWith: "Built with Next.js / React & Tailwind",
  },
  errors: {
    genericTitle: "Something went wrong",
    genericBody: "An unexpected error occurred while loading this page.",
    retry: "Try again",
    notFoundTitle: "Page not found",
    notFoundBody: "The page you're looking for doesn't exist or has moved.",
    goHome: "Go home",
    demoTitle: "This demo hit an error",
    demoBody: "Something went wrong running the mini-app. You can retry or pick another one.",
    loading: "Loading…",
  },
  todo: {
    title: "Task Manager",
    subtitle: "A simple to-do list — saved in your browser.",
    placeholder: "Add a new task...",
    inputAria: "New task",
    addAria: "Add task",
    empty: "No tasks yet. Add one above!",
    markComplete: (text: string) => `Mark "${text}" complete`,
    markIncomplete: (text: string) => `Mark "${text}" incomplete`,
    deleteAria: (text: string) => `Delete "${text}"`,
    seed: [
      "Skim through Andreas' resume",
      "Read what people say about Andreas",
      "Invite Andreas to a chat with the team",
    ],
  },
  recipe: {
    title: "Smart Chef Assistant",
    desc: "Not sure what to have for dinner? Describe what you're craving and get a recipe with an ingredient list.",
    placeholder: "What are you craving today?",
    generate: "Generate",
    instructions: "Instructions",
    ingredients: "Ingredients Needed",
    errRate: "You've made a lot of requests — give it a minute and try again.",
    errGeneric: "Couldn't generate a recipe for that. Try rephrasing your request.",
    errNetwork: "Couldn't reach the server. Please try again.",
  },
  chat: {
    greeting:
      "Hello! I'm a Gemini-powered assistant. Ask me anything about code, design, or the universe. (Each message is answered on its own — I don't keep the conversation in context.)",
    title: "AI Playground",
    poweredBy: "Powered by Google Gemini 2.5 Flash",
    placeholder: "Ask something...",
    inputAria: "Message",
    sendAria: "Send message",
    errRate: "You're sending messages quickly — give it a minute and try again.",
    errGeneric: "Sorry, I couldn't get a response. Please try again.",
    errNetwork: "Sorry, I couldn't reach the server. Please try again.",
  },
  energy: {
    title: "Energy Bill Analyzer",
    subtitle: "Upload electricity bills to generate privacy-first reports. No data is stored.",
    previewBanner:
      "Preview — the analysis backend isn't connected yet, so reports won't generate.",
    uploadBills: "Upload Bills",
    uploadBillsHint: "Upload one or multiple electricity bill PDFs.",
    uploadDataset: "Upload Previous Dataset",
    uploadDatasetHint: "Optional: merge with previous year data.",
    generate: "Generate Report",
    analyzing: "Analyzing...",
    downloadResults: "Download Results",
    downloadPdf: "Download PDF Report",
    downloadCsv: "Download CSV",
    downloadJson: "Download JSON",
    downloadZip: "Download All Files as ZIP",
    errReport: "Failed to generate report.",
    errZip: "Failed to download ZIP.",
  },
};

export type Messages = typeof en;
