import React, { useState, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, multiFactor, PhoneAuthProvider, PhoneMultiFactorGenerator, signOut} from 'firebase/auth';
import { auth } from '../firebase/config';



const PhoneAuth = ( { currentUser} ) => {
    const countryCode = "+1";
    const [ userPhone, setUserPhone ] = useState(countryCode);
    const [ otpField, setOtpField ] = useState(false);
    const [ OTP, setOTP ] = useState();
    const [ phoneVerif, setPhoneVerif ] = useState(true);
    const [verificationId, setVerificationId ] = useState(null);
    const [ error, setError ] = useState(""); 
    const [ MFUser, setMFUser ] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [time, setTime] = useState(60);
    const [timeActive, setTimeActive] = useState(false);
    
    useEffect(() => {
        let interval = null
        if(timeActive && time !== 0 ){
          interval = setInterval(() => {
            setTime((time) => time - 1)
          }, 1000)
        }else if(time === 0){
          setTimeActive(false)
          setTime(60)
          clearInterval(interval)
        }
        return () => clearInterval(interval);
      }, [timeActive, time]);

    const generateRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier('recap-cont', {
            'size': 'invisible',
            'callback': (response) => {}
        }, auth);
    }

    const createMFA = async () => {
        setOtpField(true);
        setButtonDisabled(true);
        const MFUser = multiFactor(auth.currentUser);
        MFUser.getSession().then(function(multiFactorSession) {
            const phoneInfo = {
                phoneNumber: userPhone,
                session: multiFactorSession
            };
            const phoneAuthProvider = new PhoneAuthProvider(auth);
            generateRecaptcha();
            let appVerifier = window.recaptchaVerifier;
            return phoneAuthProvider.verifyPhoneNumber(userPhone, appVerifier);
        })
        .then(function(verificationId) {
            setVerificationId(verificationId);
            setMFUser(MFUser);
            setButtonDisabled(false);
            setTimeActive(true);
            console.log(verificationId);
        });
    }

    const OTPAuth = async (e) => {
        let otp = e.target.value;
        console.log(otp);
        setOTP(otp);
        if(otp.length === 6) {
            try {
            let cred = PhoneAuthProvider.credential(verificationId, otp);
            let multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
                console.log(cred);
            await multiFactor(auth.currentUser).enroll(multiFactorAssertion, 'phone-number');
            }
            catch(error) {
                console.log(error);
            }
        }   
    }       
       
    const logout = async () => {
        await signOut(auth);
    }

    return (
        <div className="login-signup-form">
            <div className="login-html login-form">
                <div className="group">
                    <p>The last step in creating an account is verifying your phone number</p>
                    <label htmlFor="phone" className="label">Phone Number</label>
                    <input id="phone" type="tel" value={userPhone} className="input" placeholder="Phone Number..." onChange={(e) => setUserPhone(e.target.value)}/>
                    
                    { otpField === true  ? 
                        <div>
                            <label htmlFor="OTP" className="label">OTP</label>
                            <input id="OTP" type="number" value={OTP} className="input" placeholder="Passcode..." onChange={OTPAuth}/>
                        </div> 
                      : <button className="button" style={{background: timeActive ? 'red' : '#1161ee'}} onClick={createMFA} disabled={timeActive}>Request Passcode {timeActive && time}</button>}
                    <button className="button" onClick={logout}>Logout session</button>
                </div>
            </div>
            <div id="recap-cont" className="recaptcha"></div>
        </div>
    )
}


export default PhoneAuth;