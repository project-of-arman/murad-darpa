
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';

interface ApplicationChartProps {
    data: {
        name: string;
        total: number;
    }[];
}

const chartConfig = {
    total: {
        label: "Total Applications",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;


export default function ApplicationsChart({ data }: ApplicationChartProps) {
    const isMobile = useIsMobile();
    
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">কোনো আবেদনের ডেটা পাওয়া যায়নি।</p>
            </div>
        )
    }

    return (
        <div className="h-80 w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 20, bottom: isMobile ? 5 : 40, left: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            angle={isMobile ? 0 : -45}
                            textAnchor={isMobile ? "middle" : "end"}
                            height={isMobile ? 10 : 70}
                            interval={0}
                            tick={isMobile ? { dy: 10, fontSize: 0 } : { fontSize: 12 }}
                        />
                         <YAxis allowDecimals={false} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
}
