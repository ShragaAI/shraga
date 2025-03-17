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
import { isSimpleKeyValue } from '../../utils/commonUtils';

type PayloadViewerProps = {
  payload: any;
  open: boolean;
  onClose: () => void;
};

export default function PayloadViewer({ payload, open, onClose }: PayloadViewerProps) {
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
          <h3>Payload</h3>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="p-4 max-h-[60vh] overflow-auto">
          {
            (typeof payload === 'string' || typeof payload === 'number' || typeof payload === 'boolean') ? (
              <div>{payload}</div>
            ) : Array.isArray(payload) ? (
              <div>
                <ul>
                  {payload.map((item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : isSimpleKeyValue(payload) ? (
              <div className="bg-primary-lt dark:bg-primary-dk p-2">
                {Object.entries(payload).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <strong>{key}</strong>
                    <div>{value as string}</div>
                  </div>
                ))}
              </div>
            ) : (
              <JsonView
                data={payload}
                shouldExpandNode={allExpanded}
                style={{ dark: darkStyles, light: defaultStyles }[theme]}
              />
            )
          }
        </div>
      </div>
    </Modal>
  );
}
