import { IconButton, Modal as MUIModal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReactElement } from "react";

type StyledModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  renderCloseButton?: boolean;
  footer?: ReactElement;
  children: ReactElement;
};

export default function StyledModal({
  children,
  open,
  title,
  footer,
  renderCloseButton = true,
  onClose,
}: StyledModalProps) {
  return (
    <MUIModal
      open={open}
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      onClose={onClose}
    >
      <div
        className="absolute top-1/2 left-1/2 w-[600px] bg-white dark:bg-primary-dk rounded-lg"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        {title && (
          <div className="flex justify-between items-center p-4 border-b dark:border-b-[#2e2e2e]">
            <h3>{title}</h3>
            {renderCloseButton && (
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            )}
          </div>
        )}
        <div className="flex-1 p-6 max-h-[60vh] overflow-auto">{children}</div>
        {footer}
      </div>
    </MUIModal>
  );
}
