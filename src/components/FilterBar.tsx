// src/components/FilterBar.tsx
import React, { useContext, useEffect, useState } from "react";
import { Box, Button, ButtonGroup, TextField } from "@mui/material";
import { TaskContext, TaskContextType } from "../contexts/TaskContext";
import { showToast } from "../utils";

/**
 * FilterBar - wired to TaskContext.dateFilter & TaskContext.customDateRange
 * - Buttons: All, Today, This Week, Custom Range (start/end + Apply)
 */
const FilterBar: React.FC = () => {
  // ✅ Hook usage inside component
  const { dateFilter, setDateFilter, customDateRange, setCustomDateRange } = useContext(
    TaskContext,
  ) as TaskContextType;

  // local controlled inputs for date (value format: YYYY-MM-DD)
  const dateToInput = (d?: Date | null) => (d ? d.toISOString().slice(0, 10) : "");
  const [start, setStart] = useState<string>(dateToInput(customDateRange?.start));
  const [end, setEnd] = useState<string>(dateToInput(customDateRange?.end));

  // keep local inputs in sync when context changes externally
  useEffect(() => {
    setStart(dateToInput(customDateRange?.start));
    setEnd(dateToInput(customDateRange?.end));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  };

  return (
    <Box
      component="section"
      sx={{
        mb: 2,
        display: "flex",
        gap: 2,
        alignItems: "center",
        flexWrap: "wrap",
        p: 1,
      }}
      aria-label="task-date-filters"
    >
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
  );
};

export default FilterBar;
