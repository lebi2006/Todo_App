// src/components/TaskCard.tsx
import React from "react";
import { TaskItem } from "./tasks/TaskItem";

import type { Task, UUID } from "../types/user";

interface TaskCardProps {
  task: Task;
  selectedTaskId: UUID | null;
  isMobile: boolean;
  open: boolean;
  highlightMatchingText: (text: string) => React.ReactNode;
  handleClick: (event: React.MouseEvent, taskId: UUID) => void;
  actions: React.ReactNode;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  selectedTaskId,
  isMobile,
  open,
  highlightMatchingText,
  handleClick,
  actions,
}) => {
  return (
    <TaskItem
      key={task.id}
      task={task}
      features={{}}
      selection={{}}
      onContextMenu={(e) => handleClick(e, task.id)}
      actions={actions}
      blur={selectedTaskId !== task.id && open && !isMobile}
      textHighlighter={highlightMatchingText}
    />
  );
};

export default TaskCard;
