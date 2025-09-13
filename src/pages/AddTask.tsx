import { Category, Task } from "../types/user";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AddTaskButton, Container, StyledInput } from "../styles";
import { AddTaskRounded, CancelRounded } from "@mui/icons-material";
import { IconButton, InputAdornment, Tooltip } from "@mui/material";
import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { ColorPicker, TopBar, CustomEmojiPicker } from "../components";
import { UserContext } from "../contexts/UserContext";
import { useStorageState } from "../hooks/useStorageState";
import { useTheme } from "@emotion/react";
import { generateUUID, getFontColor, isDark, showToast } from "../utils";
import { ColorPalette } from "../theme/themeConfig";
import InputThemeProvider from "../contexts/InputThemeProvider";
import { CategorySelect } from "../components/CategorySelect";
import { useToasterStore } from "react-hot-toast";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import type { Priority } from "../../types/user";


const AddTask = () => {
  const { user, setUser } = useContext(UserContext);
  const theme = useTheme();
  const [name, setName] = useStorageState<string>("", "name", "sessionStorage");
  const [emoji, setEmoji] = useStorageState<string | null>(null, "emoji", "sessionStorage");
  const [color, setColor] = useStorageState<string>(theme.primary, "color", "sessionStorage");
  const [description, setDescription] = useStorageState<string>(
    "",
    "description",
    "sessionStorage",
  );
  const [deadline, setDeadline] = useStorageState<string>("", "deadline", "sessionStorage");
  const [nameError, setNameError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useStorageState<Category[]>(
    [],
    "categories",
    "sessionStorage",
  );

  const [priorityId, setPriorityId] = useState<string>("");

  const [isDeadlineFocused, setIsDeadlineFocused] = useState<boolean>(false);

  const n = useNavigate();
  const { toasts } = useToasterStore();

  useEffect(() => {
    document.title = "Todo App - Add Task";
  }, []);

  useEffect(() => {
    if (name.length > TASK_NAME_MAX_LENGTH) {
      setNameError(`Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`);
    } else {
      setNameError("");
    }
    if (description.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(
        `Description should be less than or equal to ${DESCRIPTION_MAX_LENGTH} characters`,
      );
    } else {
      setDescriptionError("");
    }
  }, [description.length, name.length]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (newName.length > TASK_NAME_MAX_LENGTH) {
      setNameError(`Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`);
    } else {
      setNameError("");
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = event.target.value;
    setDescription(newDescription);
    if (newDescription.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(
        `Description should be less than or equal to ${DESCRIPTION_MAX_LENGTH} characters`,
      );
    } else {
      setDescriptionError("");
    }
  };

  const handleDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(event.target.value);
  };

  const handleAddTask = () => {
    if (name === "") {
      showToast("Task name is required.", {
        type: "error",
        id: "task-name-required",
        preventDuplicate: true,
        visibleToasts: toasts,
      });
      return;
    }

    if (nameError !== "" || descriptionError !== "") {
      return;
    }
    const priorityObj = user.settings?.priorities?.find((p: Priority) => p.id === priorityId) ?? null;


    const newTask: Task = {
      id: generateUUID(),
      done: false,
      pinned: false,
      name,
      description: description !== "" ? description : undefined,
      emoji: emoji ? emoji : undefined,
      color,
      date: new Date(),
      deadline: deadline !== "" ? new Date(deadline) : undefined,
      priority: priorityObj,
      category: selectedCategories ? selectedCategories : [],
    };

    setUser((prevUser) => ({
      ...prevUser,
      tasks: [...prevUser.tasks, newTask],
    }));

    n("/");

    showToast(
      <div>
        Added task - <b>{newTask.name}</b>
      </div>,
      {
        icon: <AddTaskRounded />,
      },
    );

    const itemsToRemove = ["name", "color", "description", "emoji", "deadline", "categories"];
    itemsToRemove.map((item) => sessionStorage.removeItem(item));
  };

  return (
    <>
      <TopBar title="Add New Task" />
      <Container>
        <CustomEmojiPicker
          emoji={typeof emoji === "string" ? emoji : undefined}
          setEmoji={setEmoji}
          color={color}
          name={name}
          type="task"
        />
        <InputThemeProvider>
          <StyledInput
            label="Task Name"
            name="name"
            placeholder="Enter task name"
            autoComplete="off"
            value={name}
            onChange={handleNameChange}
            required
            error={nameError !== ""}
            helpercolor={nameError && ColorPalette.red}
            helperText={
              name === ""
                ? undefined
                : !nameError
                  ? `${name.length}/${TASK_NAME_MAX_LENGTH}`
                  : nameError
            }
          />
          <StyledInput
            label="Task Description"
            name="name"
            placeholder="Enter task description"
            autoComplete="off"
            value={description}
            onChange={handleDescriptionChange}
            multiline
            rows={4}
            error={descriptionError !== ""}
            helpercolor={descriptionError && ColorPalette.red}
            helperText={
              description === ""
                ? undefined
                : !descriptionError
                  ? `${description.length}/${DESCRIPTION_MAX_LENGTH}`
                  : descriptionError
            }
          />
<StyledInput
  select
  label="Priority"
  size="small"
  value={priorityId}
  onChange={(e) => setPriorityId(e.target.value as string)}
  sx={{ mt: 1, maxWidth: "400px" }}
  SelectProps={{
    displayEmpty: true,
    renderValue: (val: string) => {
      if (val === "" && priorityId === ""){ return <span />;}
      if (val === "none")
        {
          return "None";
        } 
      const p = user.settings?.priorities?.find((x) => x.id === val);
      return p ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: 6, background: p.color }} />
          <span>{p.label}</span>
        </span>
      ) : (
        "None" 
      );
    },
  }}
>
  <MenuItem value="none">
    <em>None</em>
  </MenuItem>
  {user.settings?.priorities?.map((p: Priority) => (
    <MenuItem key={p.id} value={p.id}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: 6, background: p.color }} />
        <span>{p.label}</span>
      </div>
    </MenuItem>
  ))}
</StyledInput>
          <StyledInput
            label="Task Deadline"
            name="name"
            placeholder="Enter deadline date"
            type="datetime-local"
            value={deadline}
            onChange={handleDeadlineChange}
            onFocus={() => setIsDeadlineFocused(true)}
            onBlur={() => setIsDeadlineFocused(false)}
            hidetext={(!deadline || deadline === "") && !isDeadlineFocused} 
            sx={{
              colorScheme: isDark(theme.secondary) ? "dark" : "light",
            }}
            slotProps={{
              input: {
                startAdornment:
                  deadline && deadline !== "" ? (
                    <InputAdornment position="start">
                      <Tooltip title="Clear">
                        <IconButton color="error" onClick={() => setDeadline("")}>
                          <CancelRounded />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ) : undefined,
              },
            }}
          />

          {user.settings.enableCategories !== undefined && user.settings.enableCategories && (
            <div style={{ marginBottom: "14px" }}>
              <br />
              <CategorySelect
                selectedCategories={selectedCategories}
                onCategoryChange={(categories) => setSelectedCategories(categories)}
                width="400px"
                fontColor={getFontColor(theme.secondary)}
              />
            </div>
          )}
        </InputThemeProvider>
        <ColorPicker
          color={color}
          width="400px"
          onColorChange={(color) => {
            setColor(color);
          }}
          fontColor={getFontColor(theme.secondary)}
        />
        <AddTaskButton
          onClick={handleAddTask}
          disabled={
            name.length > TASK_NAME_MAX_LENGTH || description.length > DESCRIPTION_MAX_LENGTH
          }
        >
          Create Task
        </AddTaskButton>
      </Container>
    </>
  );
};

export default AddTask;
