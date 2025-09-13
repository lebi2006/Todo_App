import type { EmojiStyle } from "emoji-picker-react";
export type UUID = ReturnType<typeof crypto.randomUUID>;
export type DarkModeOptions = "system" | "auto" | "light" | "dark";
export interface User {
  name: string | null;
  createdAt: Date;
  profilePicture: string | null;
  emojisStyle: EmojiStyle;
  tasks: Task[];
  deletedTasks: UUID[];
  categories: Category[];
  deletedCategories: UUID[];
  favoriteCategories: UUID[];
  colorList: string[];
  settings: AppSettings;
  theme: "system" | (string & {});
  darkmode: DarkModeOptions;
  lastSyncedAt?: Date;
}
export interface Task {
  id: UUID;
  done: boolean;
  pinned: boolean;
  name: string;
  description?: string;
  emoji?: string;
  color: string;
  date: Date;
  deadline?: Date;
  category?: Category[];
  lastSave?: Date;
  sharedBy?: string;
  position?: number;
  priority?: "critical" | "high" | "medium" | null;
}
export interface Category {
  id: UUID;
  name: string;
  emoji?: string;
  color: string;
  lastSave?: Date;
}
export type Priority = {
  id: UUID;
  label: string; 
  color: string; 
};
export interface AppSettings {
  enableCategories: boolean;
  doneToBottom: boolean;
  enableGlow: boolean;
  simpleEmojiPicker: boolean;
  enableReadAloud: boolean;
  appBadge: boolean;
  showProgressBar: boolean;
  voice: `${string}::${string}`;
  voiceVolume: number;
  sortOption: SortOption;
  reduceMotion: ReduceMotionOption;

  priorities?: Priority[];
}

export type SortOption = "dateCreated" | "dueDate" | "alphabetical" | "custom";
export type ReduceMotionOption = "system" | "on" | "off";
