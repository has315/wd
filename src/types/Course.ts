export interface Lesson {
  id: string;
  title: string;
  learningContent: string;
  story: string;
  reflectionQuestion: string;
  selected: boolean;
  note: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  delivery: {
    channel: "email" | "slack" | "whatsapp" | undefined;
    frequency: "daily" | "weekly" | "biweekly" | undefined;
  };
  active: boolean;
  topics: Topic[];
  totalLessons: number;
  totalTopics: number;
  entriesProccesed: number
}

export interface Topic {
  title: string;
  lessons: Lesson[];
}
