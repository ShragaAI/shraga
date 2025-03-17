import _ from "lodash";
import {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { KeyedMutator } from "swr";
import { v4 as uuid } from "uuid";

import useChatHistory from "../hooks/useChatHistory";
import useFetch from "../hooks/useFetch";
import useFlowsWithPreferences from "../hooks/useFlowsWithPreferences";
import { getAuthCookie } from "../utils/auth";
import { fetchWithTimeout } from "../utils/fetchUtils";

export type UIConfig = {
  enabled: boolean;
  name: string;
  title: string;
  question_line: string;
  background_url: string;
  bot_icon_url: string;
  sidebar_text: string;
  default_flow: string;
  list_flows: boolean;
  loading_messages: string[];
  input_max_length: number;
  map_icons_url?: string;
  map_api: {
    api_key: string;
    dark_map_id: string;
    light_map_id: string;
  }
};

export type Flow = {
  id: string;
  description: string;
  preferences?: Record<string, any>;
};

type MaxExtraResult = {
  coordinates?: number[];
  risk_level?: string;
  incident_type?: string;
}

export type RetrievalResult = {
  id? : string;
  document_id?: number;
  title: string;
  link?: string;
  description?: string;
  score?: number;
  date?: string;
  extra?: MaxExtraResult;
};

export type Message = {
  text: string;
  msg_type: 'user' | 'system' | 'feedback';
  timestamp?: string;
  position?: number;
  rtl: boolean;
  context?: any;
  allowReply?: boolean;
  error?: boolean;
  trace?: any;
  payload?: any;
  retrieval_results?: RetrievalResult[];
  feedback?: Feedback;
  feedback_text?: string;
};

export type Chat = {
  id: string;
  user_id?: string;
  draft?: boolean;
  flow: Flow;
  timestamp: Date;
  messages: Message[];
};

export enum Feedback {
  THUMBS_UP = "thumbs_up",
  THUMBS_DOWN = "thumbs_down",
}

type AppContextData = {
  configs?: UIConfig;
  flows?: Flow[];
  selectedChat: Chat | null;
  canReplyToBot: boolean;
  selectChat: (chatId: string) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSessionEditorOpen: boolean;
  setIsSessionEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chatUpdated: boolean;
  setChatUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  chats: Chat[];
  createChat: (flow: Flow) => void;
  refreshChatHistory: KeyedMutator<Chat[]>;
  sendMessage: (
    text: string,
    chatId: string,
    opts: {
      rtl?: boolean;
      onSuccess?: () => void;
      onError?: (err: any) => void;
    }
  ) => Promise<void>;
  abortMessage: () => void;
  submitFeedback: (
    feedbackData: Feedback,
    chat: Chat,
    message: Message,
    opts: {
      onSuccess?: () => void;
      onError?: (err: any) => void;
    },
    feedbackText?: string
  ) => Promise<void>;
  appSection?: string;
  setAppSection?: (section: string) => void;
  headerToolbar: ReactNode | null;
  setHeaderToolbar: React.Dispatch<React.SetStateAction<ReactNode | null>>;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

type AppProviderProps = {
  children: ReactElement;
};

const transformPreferences = (preferences?: Record<string, any>): Record<string, any> => {
  if (!preferences) return {};
  
  return Object.entries(preferences).reduce((result, [key, value]) => {
    if (value && 'default_value' in value) {
      result[key] = value.default_value;
    }
    return result;
  }, {} as Record<string, any>);
};

const AppContext = createContext<AppContextData | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export default function AppProvider({ children }: AppProviderProps) {
  const { data: flows } = useFlowsWithPreferences();
  const { data: configs } = useFetch<UIConfig>("/api/ui/configs");
  const { data: chatHistory, mutate: refreshChatHistory } = useChatHistory();

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const [appSection, setAppSection] = useState("");
  const [headerToolbar, setHeaderToolbar] = useState<ReactNode | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const selectedChat = useMemo<Chat | null>(
    () => chats.find((c) => c.id === selectedChatId) ?? null,
    [chats.map((c) => c.id), selectedChatId]
  );

  const canReplyToBot = useMemo(() => {
    const lastBotMessage = selectedChat?.messages
      .filter((m) => (m.position ?? 0) % 2 === 1)
      .pop();
    if (!lastBotMessage) return true;
    return lastBotMessage.allowReply ?? false;
  }, [selectedChat?.messages]);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSessionEditorOpen, setIsSessionEditorOpen] = useState(false);
  const [chatUpdated, setChatUpdated] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const currentChatRef = useRef<string | null>(null);

  useEffect(() => {
    document.title = configs?.title || "Shraga";
  }, [configs?.title]);

  useEffect(() => {
    if (!configs || !flows || selectedChat || chatHistory === undefined) return;

    if (chatHistory.length) {
      const startFlow: Flow = {
        id: chatHistory[0].flow.id,
        description: "",
      };
      createChat(startFlow);
      return;
    }

    const defaultFlow = configs.default_flow;
    if (Array.isArray(defaultFlow) && defaultFlow.length > 1) {
      setIsSessionEditorOpen(true);
      return;
    }

    const defaultFlowId = Array.isArray(defaultFlow) ? defaultFlow[0] : defaultFlow;
    if (defaultFlowId) {
      const flow = flows.find((flow) => flow.id === defaultFlowId);
      if (flow) {
        flow.preferences = transformPreferences(flow.preferences);
        createChat(flow);
        return;
      }
    }

    setIsSessionEditorOpen(true);
  }, [flows, configs, chatHistory]);

  useEffect(() => {
    if (chatHistory)
      setChats((chats) =>
        _.unionBy(
          chatHistory,
          chats.filter((c) => c.draft),
          "id"
        )
      );
  }, [chatHistory]);

  const createChat = (flow: Flow) => {
    abortMessage();
    const chat: Chat = {
      id: uuid(),
      draft: true,
      flow: flow,
      messages: [],
      timestamp: new Date(),
    };
    setChats((chats) => [chat, ...chats]);
    setSelectedChatId(chat.id);
  };

  const selectChat = (chatId: string) => {
    if (!chats.find((c) => c.id === chatId)) return;
    setSelectedChatId(chatId);
    if (currentChatRef.current !== chatId) abortMessage();
  };

  const _addMessageToChat = (chatId: string, message: Message) => {
    setChats((prevChats) => {
      const chatIndex = prevChats.findIndex((c) => c.id === chatId);
      if (chatIndex === -1) return prevChats;

      const updatedChat = {
        ...prevChats[chatIndex],
        messages: [...prevChats[chatIndex].messages, message],
      };

      const newChats = prevChats.filter((c) => c.id !== chatId);
      return [updatedChat, ...newChats];
    });
    setChatUpdated(true);
  };

  const sendMessage = async (
    text: string,
    chatId: string,
    {
      rtl = false,
      onSuccess,
      onError,
    }: {
      rtl?: boolean;
      onSuccess?: () => void;
      onError?: (err: any) => void;
    }
  ) => {
    const currentChatId = chatId;
    currentChatRef.current = chatId;
    abortControllerRef.current = new AbortController();

    try {
      _addMessageToChat(currentChatId, { text, msg_type: "user", rtl });
      const chat = chats.find((c) => c.id === currentChatId);
      if (!chat) return;

      const latestMessage = chat.messages[chat.messages.length - 1];
      const res = await fetchWithTimeout("/api/flows/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthCookie() ?? "",
        },
        body: JSON.stringify({
          question: text,
          flow_id: chat.flow.id,
          preferences: chat.flow.preferences ?? {},
          chat_id: chat.id,
          position: (latestMessage && latestMessage.position) ? latestMessage.position + 1 : 0,
          chat_history: chat.messages.map((m) => {
            return {
              timestamp: m.timestamp,
              text: m.text,
              msg_type: m.msg_type,
            };
          }),
        }),
        timeout: 300000,
        signal: abortControllerRef.current.signal,
      });
      const data = await res.json();
      if (res.ok && currentChatRef.current === chatId) {
        _addMessageToChat(currentChatId, {
          text: data.response_text,
          msg_type: "system",
          allowReply: data.allow_reply,
          rtl,
          retrieval_results: data.retrieval_results,
          trace: data.trace,
          payload: data.payload,
        });
        onSuccess?.();
        return;
      }
      const errMessage = data.detail;
      if (res.status === 400) {
        // client error
        throw new Error(errMessage);
      }
      // server error
      _addMessageToChat(currentChatId, {
        text: errMessage ?? "An error occurred",
        msg_type: "system",
        rtl,
        error: true,
        trace: data.trace,
        payload: data.payload,
      });
      onSuccess?.();
    } catch (err: any) {
      if (err.name === "AbortError") {
        const chatId = currentChatRef.current;
        const chatIndex = chats.findIndex((c) => c.id === chatId);
        if (chatIndex === -1) return;

        // abort
        _addMessageToChat(chatId, {
          text: "The request was aborted.",
          msg_type: "system",
          rtl,
          error: true,
        });
        onSuccess?.();
      } else if (err.name === "TimeoutError") {
        // timeout
        _addMessageToChat(currentChatId, {
          text: "The server failed to respond in time. Please try again later.",
          msg_type: "system",
          rtl,
          error: true,
        });
        onSuccess?.();
      } else {
        // remove the last message (the one that failed)
        setChats((prevChats) => {
          const prevChatsCopy = prevChats.slice();
          const chatIndex = prevChatsCopy.findIndex(
            (c) => c.id === currentChatId
          );
          if (chatIndex !== -1) {
            prevChatsCopy[chatIndex].messages.pop();
          }
          return prevChatsCopy;
        });
        onError?.(err);
      }
    } finally {
      if (currentChatRef.current === chatId) {
        abortControllerRef.current = null;
        currentChatRef.current = null;
      }
    }
  };

  const abortMessage = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const submitFeedback = async (
    feedbackData: Feedback,
    chat: Chat,
    message: Message,
    {
      onSuccess,
      onError,
    }: {
      onSuccess?: () => void;
      onError?: (err: any) => void;
    },
    feedbackText?: string
  ) => {
    try {
      const res = await fetch("/api/history/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthCookie() ?? "",
        },
        body: JSON.stringify({
          chat_id: chat.id,
          user_id: chat.user_id,
          flow_id: chat.flow.id,
          position: message.position,
          feedback: feedbackData,
          feedback_text: feedbackText,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess?.();
        return;
      }
      const errMessage = data.detail;
      throw new Error(errMessage);
    } catch (err: any) {
      onError?.(err);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <AppContext.Provider
      value={{
        configs,
        flows,
        selectedChat,
        canReplyToBot,
        selectChat,
        isSettingsOpen,
        setIsSettingsOpen,
        isSessionEditorOpen,
        setIsSessionEditorOpen,
        chatUpdated,
        setChatUpdated,
        chats,
        createChat,
        refreshChatHistory,
        sendMessage,
        abortMessage,
        submitFeedback,
        appSection,
        setAppSection,
        headerToolbar,
        setHeaderToolbar,
        isSidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
