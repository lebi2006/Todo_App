import React from "react";
import { Box, Typography } from "@mui/material";
import type { Priority } from "../types/user";

type Props = {
  priority?: Priority | null;
  size?: number;
  showLabel?: boolean;
  sx?: any;
};

const PriorityBadge: React.FC<Props> = ({ priority, size = 10, showLabel = true, sx = {} }) => {
  if (!priority) return null;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        ...sx,
      }}
      aria-label={`priority-${priority.label}`}
    >
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: priority.color,
          boxShadow: "0 0 0 2px rgba(0,0,0,0.06)",
          flexShrink: 0,
        }}
        aria-hidden
      />
      {showLabel && (
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {priority.label}
        </Typography>
      )}
    </Box>
  );
};

export default PriorityBadge;
