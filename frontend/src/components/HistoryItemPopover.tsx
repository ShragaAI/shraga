import { useRef, useState } from "react";
import { toast } from "react-toastify";

import { IconButton, Popover } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { Chat, useAppContext } from "../contexts/AppContext";
import { getAuthCookie } from "../utils/auth";

type HistoryItemPopoverProps = {
  chat: Chat;
};

export default function HistoryItemPopover({ chat }: HistoryItemPopoverProps) {
  const { selectedChat, refreshChatHistory } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const anchorEl = useRef<HTMLButtonElement | null>(null);

  const handleRemoveChat = async () => {
    if (isRemoving) return;

    if (selectedChat?.id === chat.id) {
      toast.error("Cannot remove selected chat");
      return;
    }

    setIsRemoving(true);
    const res = await fetch(`/api/history/${chat.id}`, {
      method: "DELETE",
      headers: {
        Authorization: getAuthCookie() ?? "",
      },
    });
    if (res.ok) {
      await refreshChatHistory();
    } else {
      toast.error("Failed to remove chat");
    }

    setIsRemoving(false);
    setIsOpen(false);
  };

  return (
    <>
      <IconButton
        ref={anchorEl}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Popover
        open={isOpen}
        anchorEl={anchorEl.current}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div
          className={isRemoving ? "p-2" : "p-2 cursor-pointer"}
          onClick={handleRemoveChat}
        >
          {isRemoving ? "Removing..." : "Remove"}
        </div>
      </Popover>
    </>
  );
}
