import React, {useEffect, useState} from 'react';
import './SettingsCard.css'
import {useAppDispatch, useTypedSelector} from "@hooks/customHooks.ts";
import {getQrCode, updateTwoStepAuth, verifyEnableTwoStep} from "@redux/slices";

const SettingsCard = () => {

    const dispatch = useAppDispatch();

    const {user,qrCodeLink,enableTwoStepCode} = useTypedSelector(s=>s.auth);

    const {loading,error} = useTypedSelector(s=>s.user);

    const [showQrCode,setShowQrCode] = useState<boolean>(false);

    const [message,setMessage] = useState<string>("");

    const [code,setCode] = useState<string>("");

    const twoStepAuthMessage = user?.isTwoStepAuthEnabled?"Disable two step authentication"
        :"Enable two step authentication"


    useEffect(() => {
        console.log(qrCodeLink);
        setShowQrCode(qrCodeLink!=="");
    }, [qrCodeLink]);

    useEffect(() => {
        if(enableTwoStepCode==="verified"){
            dispatch(updateTwoStepAuth({
                isEnabled:true,
                userId:user?.id!,
            }));
            setMessage("Two step auth enabled")
        }
    }, [enableTwoStepCode]);

    function handleSave(){
        dispatch(getQrCode({
            accountName:user?.firstName!,
            id:user?.id!
        }));
    }

    function unSetTwoStep() {
        dispatch(updateTwoStepAuth({
            isEnabled:false,
            userId:user?.id!,
        }));
        setMessage("Two step auth disabled")
    }

    function verifyUserCode(){
        dispatch(verifyEnableTwoStep({
            id:user?.id!,
            code:code
        }));
    }


    return (
        <div className="card-wrapper">
            <div className="card">
                {message!==""?<h2 style={{textAlign:"center"}}>{message}</h2>
                        :showQrCode? <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
                    <h2>Scan qr code  and then enter verification token</h2>
                    <img style={{width:"150px",height:"150px"}} src={qrCodeLink} alt="qr-code"/>
                    <input onChange={(e)=>setCode(e.target.value)} type="text" placeholder="Your code" className="input-search"/>
                    <button onClick={verifyUserCode} className="btn btn-confirm">Verify code</button>
                </div>:Boolean(user?.isTwoStepAuthEnabled)?
                        <button className="btn btn-info" onClick={handleSave}>Enable two step auth</button>
                        :<div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
                        <h2 style={{textAlign:"center"}}>Two step auth enabled</h2>
                        <button onClick={unSetTwoStep} className="btn btn-base btn-decline">Disable</button>
                    </div>}
            </div>
        </div>
    );
};

export default SettingsCard;
