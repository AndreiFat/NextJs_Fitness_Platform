'use client';

import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';

export default function IMCProgressChart({data}) {

    return (
        <div className="bg-white p-4 rounded shadow-md mt-4">
            <h2 className="text-lg font-bold mb-2">Evoluția IMC</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date"/>
                    <YAxis domain={['auto', 'auto']}/>
                    <Tooltip/>
                    <Line type="monotone" dataKey="imc" stroke="#10B981" strokeWidth={2} dot={{r: 4}}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}