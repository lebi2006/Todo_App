import { Dispatch, ReactNode, SetStateAction, createContext } from "react";
import type { Category, SortOption, UUID } from "../types/user";
export type StatusFilterType = "all" | "pending" | "completed";
export type PriorityFilterType = "all" | "high" | "medium" | "critical";


interface TaskState {
  selectedTaskId: UUID | null;
  anchorEl: null | HTMLElement;
  anchorPosition: { top: number; left: number } | null;
  expandedTasks: UUID[];
  multipleSelectedTasks: UUID[];
  search: string;
  editModalOpen: boolean;
  deleteDialogOpen: boolean;
  sortOption: SortOption;
  sortAnchorEl: null | HTMLElement;
  moveMode: boolean;
  dateFilter: "all" | "today" | "thisWeek" | "custom";
  customDateRange: { start: Date | null; end: Date | null };
  statusFilter: StatusFilterType;
  priorityFilter: PriorityFilterType;
}

interface TaskActions {
  setSelectedTaskId: Dispatch<SetStateAction<UUID | null>>;
  setAnchorEl: Dispatch<SetStateAction<null | HTMLElement>>;
  setAnchorPosition: Dispatch<SetStateAction<{ top: number; left: number } | null>>;
  setExpandedTasks: Dispatch<SetStateAction<UUID[]>>;
  setMultipleSelectedTasks: Dispatch<SetStateAction<UUID[]>>;
  setSearch: Dispatch<SetStateAction<string>>;
  toggleShowMore: (taskId: UUID) => void;
  handleSelectTask: (taskId: UUID) => void;
  highlightMatchingText: (text: string) => ReactNode;
  setEditModalOpen: Dispatch<SetStateAction<boolean>>;
  setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleDeleteTask: () => void;
  handleCloseMoreMenu: () => void;
  setSortOption: (option: SortOption) => void;
  setSortAnchorEl: Dispatch<SetStateAction<null | HTMLElement>>;
  setMoveMode: Dispatch<SetStateAction<boolean>>;
  updateCategory: (category: Partial<Category>) => void;
  setDateFilter: Dispatch<SetStateAction<"all" | "today" | "thisweek" | "custom">>;
  setCustomDateRange: Dispatch<SetStateAction<{ start: Date | null; end: Date | null }>>;
  setStatusFilter: Dispatch<SetStateAction<StatusFilterType>>;
  setPriorityFilter: Dispatch<SetStateAction<PriorityFilterType>>;
}

export type TaskContextType = TaskState & TaskActions;

export const TaskContext = createContext<TaskContextType>({} as TaskContextType);
