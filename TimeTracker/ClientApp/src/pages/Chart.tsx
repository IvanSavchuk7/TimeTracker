import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {SortedCalendarArr} from "@redux/intrerfaces";
import moment from "moment/moment";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
const weekDays = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday'];
export const options = {
    plugins: {
        legend: {
            position: 'top' as const,
        },
    },
    maintainAspectRatio:false
};



export interface ChartProps{
    arr:SortedCalendarArr[]
}
const Chart = ({arr}:ChartProps) => {
    const labels:string[] = [];
    const toWork:number[] = [];
    const totalHours:{ [key: number]: number }={}
    for(let i=0;i<7;i++){
        toWork[i]=0;
        totalHours[i]=0;
    }
    if(arr.length>0) {
        let index = new Date().getDay();


        while (labels.length!==weekDays.length){
            if(index===6){
                index=0;
            }
            labels.push(weekDays[index]);
            index++;
        }


        arr.map(c => {
            let dayIndex = -1;
            c.workPlans.map(wp => {
                dayIndex = wp.date.getDay();
                const et = moment(wp.endTime, "HH:mm:ss");
                const st = moment(wp.startTime, "HH:mm:ss");
                const diff = moment(et).diff(st, 'minutes');
                totalHours[dayIndex]+=diff/60;
            })
            return  c;
        });

        for (const key in totalHours) {
            const val = totalHours[key];
            if(val!==0){
                const weekIndex = labels.indexOf(weekDays[key]);
                toWork[weekIndex]=val;
            }
        }

    }


    const data = {
        labels,
        datasets: [
            {
                label:"Hours to work",
                data: [...toWork,8],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return (
        <>
            {arr.length==0?<h2>You have no plans for next week</h2>:<Line options={options} data={data}  />}
        </>
    );
};

export default Chart;
