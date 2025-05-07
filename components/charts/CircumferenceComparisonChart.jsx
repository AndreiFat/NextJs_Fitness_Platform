"use client";
import {Bar, CartesianGrid, ComposedChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

export default function CircumferenceComparisonChart({data}) {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data}>
                <CartesianGrid stroke="#f5f5f5"/>
                <XAxis dataKey="date"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>

                <Bar dataKey="abdominal_circumference" barSize={20} fill="#8884d8" name="Abdominal Circumference (cm)"/>
                <Bar dataKey="hip_circumference" barSize={20} fill="#82ca9d" name="Hip Circumference (cm)"/>
            </ComposedChart>
        </ResponsiveContainer>
    );
}