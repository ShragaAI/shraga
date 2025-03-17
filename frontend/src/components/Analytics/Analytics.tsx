import { useEffect, useState } from "react";
import useSWR from "swr";
import { Button, Tabs, Tab } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import { useAppContext, Chat } from "../../contexts/AppContext";
import { fetcher } from "../../hooks/useFetch";
import { getAuthCookie } from "../../utils/auth";
import { groupChatsByDate } from "../../utils/formatChatsDate.ts";
import { ChatHistory } from "./ChatHistory";
import { Statistics } from "./Statistics";

dayjs.extend(isBetween);

interface CustomTabPanelProps {
    children: React.ReactNode;
    value: number;
    index: number;
}
  
export const CustomTabPanel: React.FC<CustomTabPanelProps> = ({ children, value, index }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
      >
        {value === index && <div className="p-3">{children}</div>}
      </div>
    );
};

export default function Analytics() {
    const { flows, setAppSection, setHeaderToolbar } = useAppContext();
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(7, 'day'));
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
    const itemsPerPage = 20;

    const [tabValue, setTabValue] = useState(() => {
        const savedTab = sessionStorage.getItem('analyticsTab');
        return savedTab ? parseInt(savedTab) : 0;
    });

    useEffect(() => {
        sessionStorage.setItem('analyticsTab', tabValue.toString());
    }, [tabValue]);

    const headers = {
        "Content-Type": "application/json",
        "Authorization": getAuthCookie() || ""
    };

    const { data: chats, isLoading } = useSWR(
        ["analytics_chat_history", startDate, endDate],
        async ([_, start, end]) => {
            const params: { start?: string; end?: string } = {};
            if (start) params.start = (start as Dayjs).format('YYYY-MM-DD');
            if (end) params.end = (end as Dayjs).format('YYYY-MM-DD');

            const queryString = new URLSearchParams(params).toString();
            const data = await fetcher(`/api/analytics/chat-history?${queryString}`, { headers });
            
            return data.map((chat: any) => ({
                ...chat,
                id: chat.id || chat.chat_id,
                timestamp: new Date(chat.timestamp),
                messages: chat.messages.map((message: any) => ({
                    ...message,
                    isBot: message.position % 2 == 1,
                })),
            }));
        }
    );

    useEffect(() => {
        setAppSection?.('Analytics');
        
        const FilterToolbar = () => (
            <div className="flex gap-6 items-center">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
                        <DatePicker 
                            label="Start date" 
                            value={startDate}
                            onChange={setStartDate}
                            slotProps={{
                                textField: {
                                size: 'small',
                                sx: { width: '150px' }
                                }
                            }}
                        />
                        <DatePicker 
                            label="End date"
                            value={endDate}
                            onChange={setEndDate}
                            slotProps={{
                                textField: {
                                size: 'small',
                                sx: { width: '150px' }
                                }
                            }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                <div className="pt-1">
                    <Button variant="contained" onClick={() => { setStartDate(null); setEndDate(null); }}>
                        Clear Filter
                    </Button>
                </div>
            </div>
        );

        setHeaderToolbar?.(<FilterToolbar />);
        return () => setHeaderToolbar?.(null);
    }, [setAppSection, setHeaderToolbar]);

    useEffect(() => {
        if (!chats) return;

        const filtered = chats.filter((chat: Chat) => {
            const chatDate = dayjs(chat.timestamp);
            if (startDate && endDate)
                return chatDate.isBetween(startDate, endDate, 'day', '[]');
            if (startDate)
                return chatDate.isAfter(startDate) || chatDate.isSame(startDate, 'day');
            if (endDate) 
                return chatDate.isBefore(endDate) || chatDate.isSame(endDate, 'day');
            return true;
        });

        setFilteredChats(filtered);
        setPage(1);
    }, [chats, startDate, endDate]);

    const paginatedChats = filteredChats
        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
        .sort((a, b) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
    const groupedChats = groupChatsByDate(paginatedChats);
    const pagesNum = Math.ceil(filteredChats.length / itemsPerPage);

    return (
        <div className="space-y-4 flex flex-col pt-24 pb-10 min-h-screen -mt-14 items-center">
            <div className="w-full max-w-[768px] bg-white dark:bg-primary-dk rounded-lg">
                <Tabs 
                    value={tabValue} 
                    onChange={(_, newValue) => setTabValue(newValue)}
                    sx={{
                        '.dark & .MuiTab-root': {
                            color: 'white',
                            transition: 'color 0.3s ease',
                            '&:hover': {
                                color: 'white'
                            },
                            '&.Mui-selected': {
                                color: 'white'
                            },
                            '&.Mui-disabled': {
                                color: 'white'
                            }
                        },
                        '.dark & .MuiTabs-indicator': {
                            backgroundColor: 'white',
                            height: 'white'
                        }
                    }}
                >
                    <Tab label="Statistics" id="tab-0" aria-controls="tabpanel-0" />
                    <Tab label="Chat History" id="tab-1" aria-controls="tabpanel-1" />
                </Tabs>
            </div>

            <CustomTabPanel value={tabValue} index={1}>
                <ChatHistory
                    isLoading={isLoading}
                    filteredChats={filteredChats}
                    groupedChats={groupedChats}
                    pagesNum={pagesNum}
                    page={page}
                    flows={flows || []}
                    changePage={(_: React.ChangeEvent<unknown>, newPage: number) => setPage(newPage)}
                />
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={0}>
                <Statistics
                    startDate={startDate}
                    endDate={endDate}
                />
            </CustomTabPanel>
        </div>
    );
}