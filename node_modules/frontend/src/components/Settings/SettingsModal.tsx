import _ from "lodash";

import { useAppContext } from "../../contexts/AppContext";
import StyledModal from "../Base/StyledModal";
import { MenuItem, TextField } from "@mui/material";
import { useThemeContext } from "../../contexts/ThemeContext";

type SettingsModalProps = {};

export default function SettingsModal({}: SettingsModalProps) {
  const { isSettingsOpen, setIsSettingsOpen } = useAppContext();
  const { theme, setTheme } = useThemeContext();

  const handleClose = () => {
    setIsSettingsOpen(false);
  };

  return (
    <StyledModal title="Settings" open={isSettingsOpen} onClose={handleClose}>
      <>
        <TextField
          value={theme}
          label="Theme"
          select
          fullWidth
          onChange={(e) => {
            setTheme(e.target.value as "light" | "dark");
          }}
        >
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
        </TextField>
      </>
    </StyledModal>
  );
}
