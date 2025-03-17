import React, { useState, useEffect, useRef } from 'react';
import { Chat as ChatType, Feedback, Message } from "../../contexts/AppContext";

import { CircularProgress } from "@mui/material";
import Pagination from '@mui/material/Pagination';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAlt from '@mui/icons-material/ThumbDownOffAlt';

import Chat from "../Chat/Chat";

interface ChatHistoryProps {
    isLoading: boolean;
    filteredChats: ChatType[];
    groupedChats: Record<string, ChatType[]>;
    pagesNum: number;
    page: number;
    flows: any[];
    changePage: (event: React.ChangeEvent<unknown>, page: number) => void;
}

export const ChatHistory = ({
    isLoading,
    filteredChats,
    groupedChats,
    pagesNum,
    page,
    flows,
    changePage,
} : ChatHistoryProps) => {
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [selectedChatPosition, setSelectedChatPosition] = useState(0);
    const [arrowPosition, setArrowPosition] = useState(0);
    const [isPanelReady, setIsPanelReady] = useState(false);
    const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
    const chatListRef = useRef<HTMLDivElement>(null);
    const chatPanelRef = useRef<HTMLDivElement>(null);
    const previousChatRef = useRef<string | null>(null);
    const selectedChatRef = useRef<HTMLLIElement | null>(null);

    const countFeedback = (messages: Message[]) => {
        if (!messages) return { thumbsUp: 0, thumbsDown: 0 };

        return messages.reduce((acc, message) => {
            if (message.feedback === Feedback.THUMBS_UP) {
                acc.thumbsUp++;
            } else if (message.feedback === Feedback.THUMBS_DOWN) {
                acc.thumbsDown++;
            }
            return acc;
        }, { thumbsUp: 0, thumbsDown: 0 });
    };

    const closeChatPanel = () => {
        setIsSliderOpen(false);
        setShouldAnimate(true);
        previousChatRef.current = null;
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const isClickInChatList = chatPanelRef.current?.contains(target);
            const isChatItemClick = target.closest('li');
            
            if (isSliderOpen && !isChatItemClick && !isClickInChatList) {
                closeChatPanel();
            }
        };

        const updatePosition = () => {
            const listElement = chatListRef.current;
            if (isSliderOpen && chatPanelRef.current && listElement) {
                const selectedChatElement = document.querySelector(`[data-selected="true"]`) as HTMLElement;
                if (selectedChatElement && chatPanelRef.current) {
                    const chatRect = selectedChatElement.getBoundingClientRect();
                    const listRect = listElement.getBoundingClientRect();
                    const position = calculatePanelPosition(chatRect, listRect);
                    setSelectedChatPosition(position);
                    const arrowPosition = calculateArrowPosition(chatRect, listRect, position);
                    setArrowPosition(arrowPosition);
                }
            }
        };

        const timeout = setTimeout(updatePosition, 300);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            clearTimeout(timeout);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSliderOpen]);

    const calculatePanelPosition = (chatRect: DOMRect, listRect: DOMRect) => {
        const panelHeight = chatPanelRef.current?.getBoundingClientRect().height || 0;
        const relativeTop = chatRect.top - listRect.top;
        const availableHeight = listRect.height;
        let position = relativeTop - 100;

        if (position + panelHeight > availableHeight) {
            position = availableHeight - panelHeight - 20;
        }

        if (position < 0) {
            position = 0;
        }

        return position;
    };
    
    const calculateArrowPosition = (chatRect: DOMRect, listRect: DOMRect, panelPosition: number) => {
        const relativeTop = chatRect.top - listRect.top;
        return relativeTop - panelPosition + (chatRect.height / 2) - 30;
    };

    const handleChatPopoverOpen = (event: React.MouseEvent<HTMLLIElement>, chatItem: ChatType) => {

        if (chatItem.id === previousChatRef.current) {
            closeChatPanel();
            return;
        }

        const listElement = chatListRef.current;
        if (!listElement) return;

        const chatElement = event.currentTarget;
        selectedChatRef.current = chatElement;

        setIsPanelReady(false);

        if (!isSliderOpen) {
            setShouldAnimate(true);
            setIsSliderOpen(true);
        } else if (previousChatRef.current !== chatItem.id) {
            setShouldAnimate(false);
        }
        
        setSelectedChat(chatItem);
        previousChatRef.current = chatItem.id;

        setTimeout(() => {
            const chatRect = chatElement.getBoundingClientRect();
            const listRect = listElement.getBoundingClientRect();
            const position = calculatePanelPosition(chatRect, listRect);
            setSelectedChatPosition(position);
            const arrowPosition = calculateArrowPosition(chatRect, listRect, position);
            setArrowPosition(arrowPosition);

            setIsPanelReady(true);
        }, 0);
    };

    return (
        <div ref={chatListRef} className="flex relative w-full overflow-hidden">
            <div 
                className={`p-6 rounded-lg bg-white w-full grow space-y-6 dark:bg-primary-dk min-w-[768px] max-w-[768px] ${
                    shouldAnimate ? "transition-all duration-300 ease-in-out" : ""
                } ${isSliderOpen ? "mr-[36vw]" : ""}`}
            >
                <div className="flex flex-col space-y-0.5">
                    {!isLoading ? (
                        <>
                            {filteredChats.length > 0 ? (
                                <>
                                    {Object.entries(groupedChats).map(([groupTitle, groupList]) => (
                                        <ul key={groupTitle} className="flex flex-col gap-3">
                                            <div className="capitalize mt-6 mb-2 font-semibold text-sm px-2 py-2 bg-primary-lt rounded-md dark:bg-primary-dk">
                                                {groupTitle}
                                            </div>
                                            {groupList.map((chatItem: ChatType) => {
                                                const flow = flows?.find(f => f.id === chatItem.flow.id);
                                                const feedback = countFeedback(chatItem.messages);
                                                return (
                                                    <li
                                                        key={chatItem.id}
                                                        className="flex gap-4 justify-between w-full py-4 px-4 rounded-lg border border-light-stone dark:border-light-stone/50 cursor-pointer hover:bg-primary-lt dark:hover:bg-opacity-10"
                                                        onClick={(event) => handleChatPopoverOpen(event, chatItem)}
                                                    >
                                                        <div className="flex-col w-full space-y-2">
                                                            <div className="text-base font-semibold line-clamp-2 min-h-[2rem]">
                                                                {chatItem.messages?.[0]?.text || "Question"}
                                                            </div>
                                                            <div className="flex gap-4 justify-between text-sm">
                                                                <div className="line-clamp-1 text-gray-500">
                                                                    {flow?.description || ""} [{chatItem.id.slice(0, 5)}]
                                                                </div>
                                                                <div className="flex-grow">
                                                                    {chatItem.timestamp.toUTCString()}
                                                                </div>
                                                                <div className="flex gap-3 text-xs">
                                                                    <div>
                                                                        <ThumbUpOffAltIcon fontSize="small" className="cursor-pointer" /> {feedback.thumbsUp}
                                                                    </div>
                                                                    <div>
                                                                        <ThumbDownOffAlt fontSize="small" className="cursor-pointer" /> {feedback.thumbsDown}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ))}

                                    {pagesNum > 1 && (
                                        <div className="py-8 w-full flex justify-center">
                                            <Pagination 
                                                count={pagesNum} 
                                                page={page}
                                                variant="outlined" 
                                                shape="rounded"
                                                onChange={changePage}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div>No chat history</div>
                            )}
                        </>
                    ) : (
                        <CircularProgress />
                    )}
                </div>
            </div>

            {selectedChat && (
                <div 
                    ref={chatPanelRef}
                    style={{
                        top: `${selectedChatPosition}px`
                    }}
                    className={`absolute right-0 w-[35vw] bg-white dark:bg-primary-dk rounded-lg shadow-md dark:shadow-gray-300/10 max-h-[75vh] flex flex-col ${
                        shouldAnimate ? "transform transition-transform duration-300 ease-in-out" : ""
                    } ${isSliderOpen ? "translate-x-0" : "translate-x-full"}
                    ${!isPanelReady ? "opacity-0" : "opacity-100"}`}
                >
                    <div 
                        style={{
                            top: `${arrowPosition}px`
                        }}
                        className={`absolute -left-10 z-10 overflow-hidden w-10 h-16 transition-opacity duration-300 ease-in-out ${isSliderOpen ? "opacity-100" : "opacity-0"}`}
                    >
                        <div className="absolute left-5 top-2 w-10 h-10 bg-white dark:bg-primary-dk shadow-lg dark:shadow-gray-500/10 rotate-45" />
                    </div>

                    <div className="flex-1 p-6 min-h-0 overflow-y-auto">
                        <Chat 
                            readOnly={true} 
                            chatData={selectedChat}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};