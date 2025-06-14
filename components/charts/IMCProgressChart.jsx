'use client';

import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';

export default function IMCProgressChart({data}) {

    return (
        <div className="rounded mt-4 pr-6">
            <ResponsiveContainer width="100%" height={380}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151"/> {/* gri închis */}
                    <XAxis dataKey="date" stroke="#ffffff"/> {/* font alb */}
                    <YAxis domain={['auto', 'auto']} stroke="#ffffff"/> {/* font alb */}
                    <Tooltip
                        contentStyle={{backgroundColor: '#064e3b', borderRadius: '8px', borderColor: '#065f46'}}
                        itemStyle={{color: '#ffffff'}}  // text alb tooltip
                    />
                    <Line
                        type="monotone"
                        dataKey="imc"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{r: 4}}
                        activeDot={{r: 6}}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}