import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import './ProgressCircle.css'
import {useTypedSelector} from "@hooks/customHooks.ts";


interface ProgressCircleProps{
    percents:number,
    dependency?:any
}
const ProgressCircle = ({percents,dependency}:ProgressCircleProps) => {
    const {hoursToWork} = useTypedSelector(s=>s.workedHours);
    percents = isFinite(percents)?percents:0;
    const percentToCount = percents>100?100:percents;
    const circleRef = useRef<SVGCircleElement>(null);
    const radius = 80;
    const length = 2*Math.PI*radius;
    const  initial = length - (length*percentToCount)/100;

    const appear = [
        { strokeDashoffset: length },
        { strokeDashoffset: `${!isNaN(percents)?length - (length*percentToCount)/100:length}` },
    ];
    const timing={
        duration:500,
    }


    useLayoutEffect(() => {


        if(circleRef.current!==null){
            circleRef.current.animate(appear,timing);
        }
    }, [dependency,hoursToWork]);


    return (
        <div className="circle-wrapper">
            <svg>
                <circle cx="70" cy="70" r={radius}></circle>
                <circle ref={circleRef}
                        style={{strokeDashoffset:`${initial}`}}
                        cx="70" cy="70" r={radius}></circle>
            </svg>
            <div className="text">{!isNaN(percents)?Math.round(percents):0}%</div>
        </div>
    );
};

export default  ProgressCircle;
