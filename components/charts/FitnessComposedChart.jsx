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
        <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data}>
                <CartesianGrid stroke="#f5f5f5"/>
                <XAxis dataKey="date"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>

                <Bar dataKey="weight" barSize={20} fill="#8884d8" name="Weight (kg)"/>
                <Line type="monotone" dataKey="imc" stroke="#ff7300" name="IMC"/>
                <Scatter dataKey="height" fill="#82ca9d" name="Height (cm)"/>
            </ComposedChart>
        </ResponsiveContainer>
    );
}