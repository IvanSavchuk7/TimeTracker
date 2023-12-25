import React from "react";

interface FirstStepFormProps{
    setValue:(value:string)=>void,
    dispatchFunction:()=>void,
    value:string,
    placeHolder:string,
    isLastStep:boolean,
    setMatchInputValue:(value:string)=>void,
    error:string
}


const StepForm = ({setValue,error,dispatchFunction,value,placeHolder,isLastStep,setMatchInputValue}:FirstStepFormProps) => {

    function onInputChange(e:React.ChangeEvent<HTMLInputElement>){
        setValue(e.target.value);
    }

    function onMatchPasswordInputChange(e:React.ChangeEvent<HTMLInputElement>){
        setMatchInputValue(e.target.value);
    }

    return (
        <div style={{display:"flex",gap:"8px",flexDirection:"column"}}>
            <input onChange={(e)=>onInputChange(e)} value={value} className="search-input" type={isLastStep?"password":"text"} placeholder={placeHolder}/>

            {isLastStep?<div>
                <input className="search-input" onChange={(e)=>onMatchPasswordInputChange(e)} type="password" placeholder="Repeat password"/>
                <span style={{color:"red"}}>{error}</span>
            </div>:""}

            <button onClick={dispatchFunction} className="btn-base btn-info">{!isLastStep?"next":"create"}</button>
        </div>
    );
};

export default StepForm;