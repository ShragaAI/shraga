import { useMemo, useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";

import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import { CircularProgress, IconButton, TextField } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

import { useAppContext } from "../../contexts/AppContext";

type ChatInputProps = {};

const detectTextDirection = (text: string) => {
  const firstStrongChar = text.match(/[A-Za-z\u0590-\u05FF]/);
  if (firstStrongChar) {
    return /[\u0590-\u05FF]/.test(firstStrongChar[0]) ? "rtl" : "ltr";
  }
  return "ltr";
};

const WarningMessage = ({ show, inputMaxLength }: { show: boolean, inputMaxLength: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState('translate-y-0');

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setPosition('-top-7');
      
      const timer = setTimeout(() => {
        setPosition('top-0');
        setTimeout(() => {
          setIsVisible(false);
        }, 300);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div className={`flex items-center mb-1 ml-4 text-red-500 gap-2 absolute left-0 z-1 transition-transform duration-300 ${position}`}>
      <WarningIcon fontSize="small" />
      <span className="opacity-70">The message should be max {inputMaxLength} characters</span>
    </div>
  );
};

export default function ChatInput({ }: ChatInputProps) {
  const { configs, canReplyToBot, sendMessage, abortMessage, selectedChat } = useAppContext();
  const inputMaxLength = configs?.input_max_length || 1000;

  const inputRef = useRef<HTMLInputElement>(null);
  const warningTimeoutRef = useRef(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const textDirection = useMemo(() => detectTextDirection(message), [message]);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!selectedChat) {
      toast.error("No chat selected");
      return;
    }

    setLoading(true);
    sendMessage(message, selectedChat.id, {
      rtl: textDirection === "rtl",
      onSuccess: () => {
        setLoading(false);
      },
      onError: (err) => {
        console.error(err);
        toast.error("Failed to send message");
        setLoading(false);
      },
    });
    // immediately clear
    setMessage("");
  };

  const handleAbort = () => {
    abortMessage();
    setLoading(false);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const messageCount = configs?.loading_messages?.length || 1;

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const loopMessages = async () => {
      for (let i = 0; i < messageCount; i++) {
        setCurrentIndex(i);
        await delay(3000);
      }
    };
    if (loading) {
      loopMessages();
    }
  }, [loading]);

  useEffect(() => {
    return () => {
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, []);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length > inputMaxLength) {
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
        warningTimeoutRef.current = null;
      }
      
      setShowWarning(false);
      setTimeout(() => setShowWarning(true), 0);
      
      setMessage(newValue.slice(0, inputMaxLength));
    } else {
      setMessage(newValue);
    }
  };

  return (
    <div className="sticky bottom-0 w-full">
      {loading && (
        <div className="flex items-center space-x-2 pb-3 pl-2">
          <CircularProgress size={16} />
          <span className="opacity-70">
            {configs?.loading_messages?.[currentIndex] || "Compiling analysis and sources"}
          </span>
        </div>
      )}
      {!canReplyToBot && (
        <div className="flex items-center space-x-2 py-3 pl-2 rounded-xl bg-white dark:bg-[#2e2e2e]">
          <WarningIcon fontSize="small" />
          <span className="opacity-70">Follow up questions are not supported</span>
        </div>
      )}
      
      <form
        className={`relative flex items-center rounded-3xl pr-3 shadow-sm dark:shadow-lg bg-white dark:bg-[#2e2e2e] border ${!message.trim() ? 'border-primary-dk/50' : 'border-primary-dk'}`}
        onSubmit={handleSubmit}
      >
        <WarningMessage show={showWarning} inputMaxLength={inputMaxLength} />

        <TextField
          inputRef={inputRef}
          variant="standard"
          placeholder={configs?.question_line || `Ask ${configs?.name || 'Shraga'}`}
          className="relative border border-[#2e2e2e] rounded-3xl z-5 bg-white"
          fullWidth
          multiline
          dir={textDirection}
          InputProps={{
            disableUnderline: true,
            sx: {
              padding: "1rem 0 1rem 1rem",
            }
          }}
          value={message}
          onChange={handleMessageChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (message.trim()) {
                handleSubmit();
              }
            }
          }}
          disabled={loading}
        />
        <div className="self-end my-2">
          {loading ? (
            <IconButton onClick={handleAbort}>
              <StopCircleOutlinedIcon className="text-primary-dk" />
            </IconButton>
          ) : (
            <IconButton 
              type="submit" 
              disabled={!message.trim()}
            >
              <SendOutlinedIcon 
                className={`
                  transition-colors duration-200
                  ${!message.trim() 
                    ? 'text-primary-dk/50 dark:text-primary-lt/50' 
                    : 'text-primary-dk dark:text-primary-lt'}
                `}
              />
            </IconButton>
          )}
        </div>
      </form>
      <div className="w-full h-4" />
    </div>
  );
}
