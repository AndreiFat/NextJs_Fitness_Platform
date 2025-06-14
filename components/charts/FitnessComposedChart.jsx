"use client";
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Scatter,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

export default function FitnessComposedChart({data}) {
    return (
        <ResponsiveContainer width="100%" height={"100%"}>
            <ComposedChart data={data}>
                <CartesianGrid stroke="#374151"/> {/* neutral-700-ish for dark bg */}
                <XAxis dataKey="date" stroke="#d1fae5"/> {/* light-emerald text */}
                <YAxis stroke="#d1fae5"/>
                <Tooltip/>
                <Legend/>

                {/* Weight as bar – primary (green) */}
                <Bar dataKey="weight" barSize={20} fill="#22c55e" name="Greutate (kg)"/>

                {/* IMC as line – secondary (blue) */}
                <Line
                    type="monotone"
                    dataKey="imc"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{r: 4, stroke: '#3b82f6'}}
                    activeDot={{r: 6}}
                    name="IMC"
                />

                {/* Height as scatter – accent (yellow) */}
                <Scatter dataKey="height" fill="#facc15" name="Înălțime (cm)"/>
            </ComposedChart>
        </ResponsiveContainer>
    );
}