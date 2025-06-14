"use client";
import {Bar, CartesianGrid, ComposedChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

export default function CircumferenceComparisonChart({data}) {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data}>
                {/* grid gri deschis, dar mai natural */}
                <CartesianGrid stroke="#d1fae5"/> {/* verde pal (emerald-100) */}
                <XAxis dataKey="date" stroke="#ffffff"/> {/* alb */}
                <YAxis stroke="#ffffff"/>
                <Tooltip
                    contentStyle={{backgroundColor: '#064e3b', borderRadius: '8px', borderColor: '#065f46'}}
                    itemStyle={{color: '#ffffff'}}  // text alb în tooltip
                />
                <Legend wrapperStyle={{color: '#ffffff'}}/> {/* text alb legendă */}

                {/* Bar cu tonuri de verde - complementare */}
                <Bar dataKey="abdominal_circumference" barSize={20} fill="#22c55e" name="Circumferință Abdomen (cm)"/>
                <Bar dataKey="hip_circumference" barSize={20} fill="#10b981" name="Circumferință Șold (cm)"/>
            </ComposedChart>
        </ResponsiveContainer>
    );
}