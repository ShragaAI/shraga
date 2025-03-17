import _ from "lodash";
import { useEffect, useState, useRef } from "react";

import { Button, MenuItem, TextField } from "@mui/material";

import { Flow, useAppContext } from "../../contexts/AppContext";
import Preferences, { formValidator } from "./Preferences";
import StyledModal from "../Base/StyledModal";

type SessionEditorModalProps = {};

export default function SessionEditorModal({}: SessionEditorModalProps) {
  const {
    flows,
    selectedChat,
    createChat,
    isSessionEditorOpen,
    setIsSessionEditorOpen,
  } = useAppContext();

  const [draftFlow, setDraftFlow] = useState<Flow | null>(null);

  const [flowPreference, setFlowPreference] = useState<Record<string, any>>();

  const preferencesEl = useRef<formValidator>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const canCloseModal = !!selectedChat;

  const [isScrollToBottom, setIsScrollToBottom] = useState(false);

  useEffect(() => {
    if (isScrollToBottom) {
      const timer = setTimeout(() => {
        if (bottomRef.current) {
          bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
        setIsScrollToBottom(false);
      }, 150);

      return () => clearTimeout(timer); // Clean up the timeout
    }
  }, [isScrollToBottom]);

  useEffect(() => {
    const flow = flows?.find((f) => f.id === selectedChat?.flow.id);
    setDraftFlow(flow ?? null);
    handleFlowChange(selectedChat?.flow.id || "");

    return () => {
      setDraftFlow(null);
    };
  }, [selectedChat]);

  const handleFlowChange = (flowId: string) => {
    const flow = flows?.find((flow) => flow.id === flowId) ?? null;
    if (flow) {
      setDraftFlow(flow);
      setFlowPreference(flow.preferences);
    }
  };

  const handleClose = () => {
    if (!canCloseModal) return;
    setIsSessionEditorOpen(false);
  };

  const handlePreferencesChange = (preferences: { [key: string]: any }) => {
    setDraftFlow(
      (d) =>
        d && {
          ...d,
          preferences: {
            ...d.preferences,
            ...preferences,
          },
        }
    );
  };

  const handleSubmit = () => {
    if (!preferencesEl.current?.validate()) {
      setIsScrollToBottom(true);
      return;
    }
    
    if (!draftFlow) return;
    
    createChat(draftFlow);
    setIsSessionEditorOpen(false);
  };

  return (
    <StyledModal
      title="New chat session"
      open={isSessionEditorOpen}
      renderCloseButton={canCloseModal}
      onClose={handleClose}
      footer={
        <div className="flex justify-end items-center p-6">
          <Button variant="contained" onClick={handleSubmit}>
            Create chat session
          </Button>
        </div>
      }
    >
      <>
        <div className="mb-6">
          <TextField
            value={draftFlow?.id ?? ""}
            label="Select flow"
            select
            fullWidth
            SelectProps={{
              MenuProps: {
                sx: { maxWidth: '552px' },
              },
            }}
            onChange={(e) => {
              handleFlowChange(e.target.value);
            }}
          >
            {flows?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.id} - {option.description}
              </MenuItem>
            ))}
          </TextField>
        </div>
        {draftFlow ? (
          <Preferences
            preferences={flowPreference}
            handlePreferenceChange={handlePreferencesChange}
            ref={preferencesEl}
          />
        ) : (
          <p>Please select a flow to continue</p>
        )}
        <div ref={bottomRef} />
      </>
    </StyledModal>
  );
}
