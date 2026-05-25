export enum AppRoute {
    HOME = '/',
    RESUME = '/resume',
    EXPERIENCE = '/experience',
    TESTIMONIALS = '/testimonials',
    PROJECTS = '/projects',
    ENERGY = "ENERGY",
}

export interface ExperienceItem {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string[];
    techStack: string[];
}

export enum MiniAppType {
    TODO = 'todo',
    RECIPE = 'recipe',
    // GENAI = 'genai',
    // ENERGY = 'energy',
}

export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
}

export interface RecipeResponse {
    recipeName: string;
    ingredients: string[];
    instructions: string;
}