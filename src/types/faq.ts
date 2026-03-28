export interface Question {
  id: string;
  question: string;
  response: string;
  responsePublic?: string;
  rank: number;
}

export interface Category {
  label: string;
  rank: number;
  questions: Question[];
}

export interface FaqData {
  businessName: string;
  categories: Category[];
  uncategorizedQuestions: Question[];
}
