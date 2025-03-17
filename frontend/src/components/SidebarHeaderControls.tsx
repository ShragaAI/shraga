import IconButton from "@mui/material/IconButton";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import { Tooltip } from "@mui/material";

type SidebarHeaderControlsProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

export default function SidebarHeaderControls({
  isSidebarOpen,
  toggleSidebar,
}: SidebarHeaderControlsProps) {
  return (
    <>
      <Tooltip
        title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        enterDelay={200}
        enterNextDelay={200}
      >
        <IconButton onClick={toggleSidebar}>
          <ExpandCircleDownOutlinedIcon
            sx={{
              transform: isSidebarOpen ? "rotate(90deg)" : "rotate(-90deg)",
            }}
          />
        </IconButton>
      </Tooltip>
    </>
  );
}
