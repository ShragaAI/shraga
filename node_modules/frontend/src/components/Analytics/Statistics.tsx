import useSWR from "swr";
import { getAuthCookie } from "../../utils/auth";
import { fetcher } from "../../hooks/useFetch";
import { Dayjs } from "dayjs";

import { BarChart } from '@mui/x-charts/BarChart';
import { CircularProgress } from "@mui/material";

interface PercentilesChartProps {
    data: Record<string, number>;
    title: string;
    color: string;
}

type Step = {
    step: string;
    total_count: number;
    input_tokens: Record<string, number>;
    output_tokens: Record<string, number>;
    latency: Record<string, number>;
};

type AnalyticsData = {
    steps: Step[];
    feedback: {
        none: number;
        positive: number;
        negative: number;
    }
};

const PercentilesChart = ({ data, title, color } : PercentilesChartProps) => {
    if (!data) return null;

    const dataset = Object.entries(data).map(([percentile, value]) => ({
        percentile,
        value
    }));

    return (
        <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <BarChart
                width={undefined}
                height={300}
                dataset={dataset}
                margin={{ 
                    left: 55,
                    right: 20,
                    top: 20,
                    bottom: 50 
                }}
                xAxis={[
                    { 
                        scaleType: 'band', 
                        dataKey: 'percentile',
                        label: 'Percentile (%)',
                        tickLabelPlacement: 'middle',
                    }
                ]}
                series={[
                    { 
                        dataKey: 'value',
                        color: color,
                        valueFormatter: (value: number | null) => 
                            value !== null ? value.toFixed(2) : ''
                    }
                ]}
            />
        </div>
    );
};

export const Statistics = ({ startDate, endDate }: { startDate: Dayjs | null; endDate: Dayjs | null }) => {

    const headers = {
        "Content-Type": "application/json",
        "Authorization": getAuthCookie() || ""
    };

    const { data, isLoading } = useSWR(
        ["chat_analytics", startDate, endDate],
        async ([_, start, end]) => {
            const params: { start?: string; end?: string } = {};
            if (start) params.start = (start as Dayjs).format('YYYY-MM-DD');
            if (end) params.end = (end as Dayjs).format('YYYY-MM-DD');

            const data: AnalyticsData = await fetcher(`/api/analytics/`, {
                headers, 
                method: "POST", 
                body: JSON.stringify(params)    
            });
            return data;
        }
    );

    if (isLoading || !data) {
        return (
            <div className="p-6 rounded-lg bg-white w-full grow space-y-6 dark:bg-primary-dk min-w-[768px]">
                <div className="flex flex-col gap-y-16">
                    <CircularProgress />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 rounded-lg bg-white w-full grow space-y-8 dark:bg-primary-dk min-w-[768px]">
            {data?.steps && data?.steps.length ? (
                <>
                    {data?.steps.map((step: any) => (
                        <div className="flex flex-col gap-y-10">
                            <h2 className="capitalize">{step.step}</h2>
                            <PercentilesChart 
                                data={step.latency} 
                                title="Latency Percentiles"
                                color="#8884d8"
                            />

                            <PercentilesChart 
                                data={step.input_tokens} 
                                title="Input Tokens Percentiles"
                                color="#82ca9d"
                            />
                            
                            <PercentilesChart 
                                data={step.output_tokens} 
                                title="Output Tokens Percentiles"
                                color="#ffc658"
                            />
                        </div>
                    ))}
                </>
            ) : (
                <div className="flex flex-col gap-y-16">
                    <div>No chat statistics</div>
                </div>
            )}
        </div>
    );
};