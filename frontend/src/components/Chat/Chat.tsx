import { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DataObjectOutlinedIcon from "@mui/icons-material/DataObjectOutlined";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { green } from "@mui/material/colors";

import { Button } from "@mui/material";

import classNames from "classnames";
import { Chat as ChatType, Message, RetrievalResult, useAppContext } from "../../contexts/AppContext";
import { useThemeContext } from "../../contexts/ThemeContext";
import { isDataEmpty } from "../../utils/commonUtils";
import ShowReference from "../Icons/ShowReference";
import ChatReference from "./ChatReference";
import FeedbackButtons from "./FeedbackButtons";
import JSONViewer from "./JSONViewer";
import MapWidget, { MapMarker } from "./Maps/MapWidget";
import PayloadViewer from "./PayloadViewer";

type MarkerWithCoordinates = RetrievalResult & { extra: { coordinates: [number, number] } };

const hasValidCoordinates = (marker: RetrievalResult): marker is MarkerWithCoordinates => {
  return (
    marker.extra !== undefined &&
    marker.extra !== null &&
    marker.extra.coordinates !== undefined &&
    Array.isArray(marker.extra.coordinates) &&
    marker.extra.coordinates.length === 2 &&
    typeof marker.extra.coordinates[0] === 'number' &&
    typeof marker.extra.coordinates[1] === 'number'
  );
};

const getMarkers = (message: Message) : MapMarker[] => {
  let markers: MapMarker[] | RetrievalResult[] = [];
  if (message.payload.map_points && message.payload.map_points.length > 0) {
    markers = message.payload.map_points;
  } else if (message.retrieval_results && message.retrieval_results.length > 0) {
    markers = message.retrieval_results;
  }

  return markers
    .filter(hasValidCoordinates)
    .map((result: MarkerWithCoordinates) => ({
      position: result.extra?.coordinates ?? [],
      title: result.title,
      risk_level: result.extra.risk_level ?? '',
      date: result.date ?? '',
      link: result.link ?? '',
      incident_type: result.extra.incident_type ?? ''
    }));
}

export default function Chat({ readOnly = false, chatData }: { readOnly?: boolean, chatData?: ChatType }) {
  const { configs, selectedChat, submitFeedback, chatUpdated, setChatUpdated } =
    useAppContext();
  const { theme, setChatBackground } = useThemeContext();

  const bottomRef = useRef<HTMLDivElement>(null);

  const [trace, setTrace] = useState<Record<string, any> | null>(null);
  const [payload, setPayload] = useState<any>(null);
  const [copied, setCopied] = useState<{ [key: number]: boolean }>({});

  const setCopiedMessages = (index: number, copied: boolean) => {
    if (copied) {
      setCopied({ [index]: true });
    } else {
      setCopied((prevState) => ({
        ...prevState,
        [index]: copied,
      }));
    }
  };

  const [expandedMessages, setExpandedMessages] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleMessage = (index: number) => {
    setExpandedMessages((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  useEffect(() => {
    if (chatUpdated && bottomRef.current && !readOnly) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      setChatUpdated(false);
    }
  }, [chatUpdated]);

  useEffect(() => {
    if (bottomRef.current && !readOnly) {
      bottomRef.current.scrollIntoView({ behavior: "auto" });
    }
    setExpandedMessages({});
  }, [selectedChat?.id]);

  useEffect(() => {
    if (configs?.background_url) setChatBackground(configs?.background_url);
  }, [configs?.background_url]);

  const chatObject = chatData || selectedChat;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 ">
        <div className={`pt-3 px-3 ${readOnly ? "pb-3" : " pb-20"}`}>
          {chatObject?.messages.map((message, index) =>
            message.msg_type === "system" ? (
              <div
                key={`${Math.floor(Math.random() * 10000)} ${message.text ? message.text.slice(
                  0,
                  10
                ) : ""}`}
                className="flex-col px-3"
              >
                <div
                  className={classNames(
                    "flex gap-2 p-2 mb-2 rounded-xl",
                    {
                      "bg-white dark:bg-[#2e2e2e]": !readOnly,
                      "bg-primary-lt dark:bg-[#2e2e2e]": readOnly,
                      "border border-red-500": message.error,
                    }
                  )}
                >
                  <div
                    className={classNames("flex mt-2 ml-1.5", {
                      "!text-red-500": message.error,
                    })}
                  >
                    {configs?.bot_icon_url ? (
                      <img
                        src={configs?.bot_icon_url}
                        alt="Custom Icon"
                        className="w-6 h-6"
                      />
                    ) : (
                      <SmartToyIcon />
                    )}
                  </div>
                  <div dir="auto" className="flex-1 p-2 w-full">
                    {message.payload?.routing?.show_map ? (
                      (() => {
                        const markers = getMarkers(message);
                        return markers.length > 0 ? (
                          <MapWidget
                            markers={markers}
                            isDarkMode={theme === 'dark'}
                            incidentTypes={message.payload.routing.incident_types}
                            dateRange={{
                                start: message.payload.routing.timerange.from_,
                                end: message.payload.routing.timerange.to
                            }}
                            locations={message.payload.routing.locations}
                          />
                        ) : null;
                      })()
                    ) : null}

                    <ReactMarkdown
                      className="break-words whitespace-pre-wrap"
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: (props) => (
                          <a
                            className="underline underline-offset-4 text-dark-blue dark:text-link-white"
                            href={props.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {props.children}
                          </a>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-5">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pl-5">{children}</ol>
                        ),
                        table: ({ children }) => (
                          <table className="table-auto border-collapse border border-gray-300">
                            {children}
                          </table>
                        ),
                        th: ({ children }) => (
                          <th className="border border-gray-300 px-4 py-2">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border border-gray-300 px-4 py-2">
                            {children}
                          </td>
                        ),
                      }}
                    >
                      {message.text && message.text.split(/\n{2,}/).join("\n")}
                    </ReactMarkdown>

                    <div className="flex space-x-2">
                      {!isDataEmpty(message.trace) && (
                        <div className="pt-2">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DataObjectOutlinedIcon />}
                            onClick={() => setTrace(message.trace ?? {})}
                          >
                            Trace
                          </Button>
                        </div>
                      )}
                      {!isDataEmpty(message.payload) && (
                        <div className="pt-2">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DataObjectOutlinedIcon />}
                            className="pt-2"
                            onClick={() => setPayload(message.payload)}
                          >
                            Payload
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex p-2 mb-2 gap-3 items-center opacity-85 border-t dark:border-t-[#2e2e2e]">
                  {!readOnly && selectedChat && (
                    <FeedbackButtons
                      index={index}
                      submitFeedback={submitFeedback}
                      chat={selectedChat}
                      message={message}
                    />
                  )}
                  {message.retrieval_results &&
                    message.retrieval_results.length > 0 && (
                      <div
                        className={`flex items-center cursor-pointer ${
                          expandedMessages[index] && "text-green-500"
                        }`}
                        onClick={() => toggleMessage(index)}
                      >
                        <ShowReference width="w-5" height="h-5" />
                        <span className="text-sm ml-2">Show References ({message.retrieval_results.length})</span>
                      </div>
                    )}
                  <CopyToClipboard
                    text={message.text}
                    onCopy={() => {
                      setCopiedMessages(index, true);
                      setTimeout(() => setCopiedMessages(index, false), 3000);
                    }}
                  >
                    <div className="flex items-center cursor-pointer">
                      <ContentCopyIcon
                        fontSize="small"
                        sx={{ color: copied[index] ? green[500] : {} }}
                      />
                      {copied[index] ? (
                        <span className="text-green-500 text-sm ml-2">
                          Copied!
                        </span>
                      ) : (
                        <span className="text-sm ml-2">Copy</span>
                      )}
                    </div>
                  </CopyToClipboard>
                  {/*<div*/}
                  {/*  className="flex items-center cursor-pointer text-sm"*/}
                  {/*  onClick={() => alert("Downloading")}*/}
                  {/*>*/}
                  {/*  <DownloadIcon fontSize="small" />*/}
                  {/*  <span className="text-sm">Download PDF</span>*/}
                  {/*</div>*/}
                </div>
                {expandedMessages[index] && (
                  <ChatReference retrievalResults={message.retrieval_results} />
                )}
              </div>
            ) : (
              <div
                className={classNames("flex mb-2", {
                  "justify-end": !message.rtl,
                  "justify-start": message.rtl,
                })}
                key={`${Math.floor(Math.random() * 10000)} ${message.text ? message.text.slice(
                  0,
                  10
                ) : ""}`}
              >
                <div
                  dir="auto"
                  className={`max-w-[400px] py-2 px-3 rounded-xl ${readOnly ? "bg-primary-lt dark:bg-[#2e2e2e]" : "bg-white dark:bg-[#2e2e2e]"}`}
                >
                  <ReactMarkdown
                    className="break-words whitespace-pre-wrap"
                    remarkPlugins={[remarkGfm]}
                  >
                    {message.text}
                  </ReactMarkdown>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <JSONViewer
        json={trace ?? {}}
        open={!!trace}
        onClose={() => setTrace(null)}
      />
      <PayloadViewer
        payload={payload}
        open={!!payload}
        onClose={() => setPayload(null)}
      />
      <div ref={bottomRef} />
    </div>
  );
}
