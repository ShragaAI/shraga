import {
  JsonView,
  allExpanded,
  darkStyles,
  defaultStyles,
} from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

import { IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useThemeContext } from "../../contexts/ThemeContext";

type JSONViewerProps = {
  json: Object | any[];
  open: boolean;
  onClose: () => void;
};

export default function JSONViewer({ json, open, onClose }: JSONViewerProps) {
  const { theme } = useThemeContext();

  return (
    <Modal
      open={open}
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      onClose={onClose}
    >
      <div
        className="absolute top-1/2 left-1/2 w-[600px] bg-primary-lt dark:bg-primary-dk rounded-lg"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-b-[#2e2e2e]">
          <h3>Trace</h3>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="p-4 max-h-[60vh] overflow-auto">
          <JsonView
            data={json}
            shouldExpandNode={allExpanded}
            style={{ dark: darkStyles, light: defaultStyles }[theme]}
          />
        </div>
      </div>
    </Modal>
  );
}
