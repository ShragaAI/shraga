import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import SidebarHeaderControls from "./SidebarHeaderControls";
import { IconButton, Tooltip } from "@mui/material";
import { useAppContext } from "../contexts/AppContext";
import AccountPopover from "./AccountPopover";

type HeaderProps = {
  sidebarControl?: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

export default function Header({ isSidebarOpen, toggleSidebar, sidebarControl = true }: HeaderProps) {
  const { configs, setIsSettingsOpen, appSection, headerToolbar } = useAppContext();

  return (
    <header className="sticky top-0 z-10 flex justify-between items-center py-2 px-4 shadow-sm dark:border-b dark:border-b-[#2e2e2e] bg-white dark:bg-primary-dk">
      <div className="flex items-center gap-3">
        {!isSidebarOpen && sidebarControl && (
          <div className="flex items-center">
            <SidebarHeaderControls
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
          </div>
        )}
        <h2><a href="/">{configs?.title || 'Shraga'}</a>{appSection && ` - ${appSection}`}</h2>
      </div>
      <div className="flex">
        {headerToolbar && (
          <div className="mr-10 flex items-center">{headerToolbar}</div>
        )}
        
        <Tooltip title="Settings" enterDelay={300} enterNextDelay={300}>
          <IconButton onClick={() => setIsSettingsOpen(true)}>
            <SettingsOutlinedIcon />
          </IconButton>
        </Tooltip>
        <AccountPopover />
      </div>
    </header>
  );
}
