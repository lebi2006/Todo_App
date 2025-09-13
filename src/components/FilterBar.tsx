import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { TaskContext, TaskContextType, StatusFilterType, PriorityFilterType } from "../contexts/TaskContext";
import { showToast } from "../utils";

const FilterBar: React.FC = () => {
  const ctx = useContext(TaskContext) as TaskContextType;

  const dateFilter: "all" | "today" | "thisWeek" | "custom" = ctx?.dateFilter ?? "all";
  const setDateFilter: (v: "all" | "today" | "thisWeek" | "custom") => void =
    ctx?.setDateFilter ?? (() => {});
  const customDateRange: { start: Date | null; end: Date | null } =
    ctx?.customDateRange ?? { start: null, end: null };
  const setCustomDateRange: (r: { start: Date | null; end: Date | null }) => void =
    ctx?.setCustomDateRange ?? (() => {});

  const statusFilter: StatusFilterType = ctx?.statusFilter ?? "all";
  const setStatusFilter: (s: StatusFilterType) => void = ctx?.setStatusFilter ?? (() => {});

  const priorityFilter: PriorityFilterType = ctx?.priorityFilter ?? "all";
  const setPriorityFilter: (p: PriorityFilterType) => void = ctx?.setPriorityFilter ?? (() => {});
  const dateToInput = (d?: Date | null) => (d ? d.toISOString().slice(0, 10) : "");
  const [start, setStart] = useState<string>(dateToInput(customDateRange?.start));
  const [end, setEnd] = useState<string>(dateToInput(customDateRange?.end));

  useEffect(() => {
    setStart(dateToInput(customDateRange?.start));
    setEnd(dateToInput(customDateRange?.end));
  }, [customDateRange?.start?.toISOString?.(), customDateRange?.end?.toISOString?.()]);

  const applyRange = () => {
    if (!start && !end) {
      showToast("Please choose at least one date for custom range.", { type: "error" });
      return;
    }
    if (start && end && new Date(start) > new Date(end)) {
      showToast("Start date cannot be after end date.", { type: "error" });
      return;
    }

    setCustomDateRange({
      start: start ? new Date(start) : null,
      end: end ? new Date(end) : null,
    });
    setDateFilter("custom");
  };

  const reset = () => {
    setDateFilter("all");
    setCustomDateRange({ start: null, end: null });
    setStart("");
    setEnd("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  return (
  <Box
    component="section"
    sx={{
      mb: 2,
      display: "flex",
      flexDirection: "column", 
      gap: 2,
      p: 1,
    }}
    aria-label="task-date-filters"
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      <ButtonGroup variant="outlined" size="small" aria-label="date filters">
        <Button
          onClick={() => setDateFilter("all")}
          variant={dateFilter === "all" ? "contained" : "outlined"}
        >
          All
        </Button>
        <Button
          onClick={() => setDateFilter("today")}
          variant={dateFilter === "today" ? "contained" : "outlined"}
        >
          Today
        </Button>
        <Button
          onClick={() => setDateFilter("thisWeek")}
          variant={dateFilter === "thisWeek" ? "contained" : "outlined"}
        >
          This week
        </Button>
      </ButtonGroup>

      <TextField
        label="Start"
        type="date"
        size="small"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="End"
        type="date"
        size="small"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" size="small" onClick={applyRange}>
        Apply range
      </Button>
      <Button variant="text" size="small" onClick={reset}>
        Reset
      </Button>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Status:
        </Typography>
        <ToggleButtonGroup
          size="small"
          value={statusFilter}
          exclusive
          onChange={(_e, val) => {
            if (val !== null) setStatusFilter(val as StatusFilterType);
          }}
          aria-label="status filter"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="pending">Pending</ToggleButton>
          <ToggleButton value="completed">Completed</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Priority:
        </Typography>
        <ToggleButtonGroup
          size="small"
          value={priorityFilter}
          exclusive
          onChange={(_e, val) => {
            if (val !== null) setPriorityFilter(val as PriorityFilterType);
          }}
          aria-label="priority filter"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="critical">Critical</ToggleButton>
          <ToggleButton value="high">High</ToggleButton>
          <ToggleButton value="medium">Medium</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  </Box>
);


};

export default FilterBar;
