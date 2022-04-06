import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, 
    onAuthStateChanged, RecaptchaVerifier, sendEmailVerification, PhoneAuthProvider, getMultiFactorResolver, PhoneMultiFactorAssertion, PhoneMultiFactorGenerator, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { async } from "@firebase/util";
import PhoneAuth from "./PhoneAuth";

const Auth = ({ clicked, setClicked }) => {
    

    const [ registerEmail, setRegisterEmail ] = useState("");
    const [ registerPassword, setRegisterPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const [ loginEmail, setLoginEmail ] = useState("");
    const [ loginPassword, setLoginPassword ] = useState("");
    const [ reqEmail, setReqEmail ] = useState(false);
    const [user, setUser] = useState({});
    const [ emailVerif, setEmailVerif ] = useState(true);
    const [ userPhone, setUserPhone ] = useState(null);
    const [ showOTP, setShowOTP ] = useState(false);
    const [ OTP, setOTP ] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [time, setTime] = useState(60);
    const [timeActive, setTimeActive] = useState(false);
    const [error, setError] = useState('');
    const [ validField, setValidField ] = useState(true);
    const [ verificationId, setVerificationId ] = useState('');

    let fieldStyle;
    if(!validField) {
        fieldStyle = {
            border: '1px solid red'
        }
    } else {
        fieldStyle = {
            border: "none"
        }
    }

    const timeout = async ms => new Promise(res => setTimeout(res, ms));

    const generateRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier('recap-cont', {
            'size': 'invisible',
            'callback': (response) => {}
        }, auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return () => {
            unsubscribe();
        }
    }, []);


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

    const resetFields = () => {
        Array.from(document.querySelectorAll('input').forEach(input => (input.value = "")));
    }
    
    const validateEmailAddress = () => {
        let isValid = true;
        let pattern = new RegExp(/^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i);
        if(!pattern.test(registerEmail)) {
            setError("Email is not valid");
            alert("Email not valid");
            return isValid = false;
        } else {
            return isValid;
        }
        
    };

    const validatePassword = () => {
        console.log('passCheck1');
        let isValid = true;
        if (registerPassword !== confirmPassword) {
            setError('Passwords does not match');
            alert("Passwords do not match");
            return isValid = false
        } else {
        console.log('passCheck2');
        return isValid;
        }
      }

    

    const register = async () => {
        if(validateEmailAddress()) {
            if(validatePassword()) {
                try {
                    setReqEmail(true);
                    setButtonDisabled(true);
                    const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
                    const actionCodeSettings = {
                        url: 'https://treewoman.net/?uid=' + auth.currentUser.email,
                        handleCodeInApp: true,
                    };
                await sendEmailVerification(auth.currentUser, actionCodeSettings);
                setButtonDisabled(false);
                setTimeActive(true);
                resetFields();
                console.log(user);
                } catch (error) {
                    console.log(error.message);
                }
            }    
        }
    };

  
    let resolver;
    const login = async () => {
        setShowOTP(true);

        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
        }   catch (error)  {
            if(error.code === 'auth/multi-factor-auth-required') {
                window.resolver = getMultiFactorResolver(auth, error);
                console.log(window.resolver);
            }    
        }        
        const phoneInfo = {
            multiFactorHint: window.resolver.hints[0],
            session: window.resolver.session,
        }
        
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        
        generateRecaptcha();
        let appVerifier = window.recaptchaVerifier;

        window.verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfo, appVerifier)
        console.log(window.verificationId);        
        alert("sms sent!");               
    };

    const verifyOTP = async (e) => {
        
        console.log(resolver);
        let otp = e.target.value;
        console.log(otp);
        setOTP(otp);
        if(otp.length === 6) {
            const cred = PhoneAuthProvider.credential(window.verificationId, otp);
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
            const credential = await window.resolver.resolveSignIn(multiFactorAssertion);
            console.log(credential);
            
        }
        
    }
    
    


    const resendEmail = async () => {
        try {
            setButtonDisabled(true);
            const actionCodeSettings = {
                url: 'https://treewoman.net/?uid=' + auth.currentUser.email,
                handleCodeInApp: true,
           };
           console.log(auth.currentUser);
            await sendEmailVerification(auth.currentUser, actionCodeSettings);
            setButtonDisabled(false);
            setTimeActive(true);
        } catch (error) {
            console.log(error.message);
            setButtonDisabled(false);
        }
    }
    

    
    const logout = async () => {
        setLoginEmail("");
        setLoginPassword("");
        setClicked(false);
        await signOut(auth);
        
      };
   
    return (
        <div>
            <div className="login-signup-form">
                <div className="login-html">
                        <input id="tab-1" type="radio" name="tab" className="sign-in" defaultChecked/>
                        <label htmlFor="tab-1" className="tab">Sign In</label>
                        <input id="tab-2" type="radio" name="tab" className="sign-up"/>
                        <label htmlFor="tab-2" className="tab">Sign Up</label>
                        
                    <div className="login-form">
                        <div className="sign-in-htm">
                            <div>
                                <div className="group">
                                    <label htmlFor="email" className="label">Email</label>
                                    <input id="email" placeholder="Email..." className="input" onChange={(e) => setLoginEmail(e.target.value)}/>
                                </div>
                                <div className="group">
                                    <label htmlFor="pass" className="label">Password</label>
                                    <input id="pass" type="password" placeholder="Password..." className="input" data-type="password" onChange={(e) => setLoginPassword(e.target.value)}/>
                                </div>
                                <div className="group">
                                    <button className="button" onClick={login}>Login</button>
                                </div>
                                { showOTP && <div>
                                    <label htmlFor="OTP" className="label">OTP</label>
                                    <input id="OTP" type="number" value={OTP} className="input" placeholder="Passcode..." onChange={verifyOTP}/>
                                 </div> }
                            </div>
                            { !emailVerif && 
                            <div className="group">
                                <label htmlFor="reqEmailLink" className="label" style={{textAlign: "center"}}>Your email is unverified</label>
                                <button id="reqEmail" className="button" style={{background: timeActive ? 'red' : '#1161ee'}} onClick={resendEmail} disabled={timeActive}>Send Email Link {timeActive && time}</button>
                                <button className="button" onClick={logout}>Logout session</button>
                            </div>
                            
                            }
                        </div> 
                        <div className="sign-up-htm">
                            <div className="group">
                                <label htmlFor="signUpEmail" className="label">Email</label>
                                <input id="signUpEmail" type="text" className="input" placeholder="Email..." style={fieldStyle} onChange={(e) => setRegisterEmail(e.target.value)}/>
                            </div>
                            <div className="group">
                                <label htmlFor="signUpPass" className="label">Password</label>
                                <input id="signUpPass" type="password" className="input" data-type="password" placeholder="Password..." style={fieldStyle} onChange={(e) => setRegisterPassword(e.target.value)}/>
                            </div>
                            <div className="group">
                                <label htmlFor="confirmPass" className="label">Confirm Password</label>
                                <input id="confirmPass" type="password" className="input" data-type="password" placeholder="Confirm Password..." style={fieldStyle} onChange={(e) => setConfirmPassword(e.target.value)}/>
                            </div>
                        { !reqEmail && <div className="group">
                                <button id="reqEmail" className="button" onClick={register}>Request Email Link</button>
                            </div>}
                            { reqEmail && 
                            <div className="group">
                                <label htmlFor="reqEmailLink" className="label">Please Check your Email for verification link</label>
                                <button id="reqEmail" className="button" style={{background: timeActive ? 'red' : '#1161ee'}} onClick={resendEmail} disabled={timeActive}>Resend Email {timeActive && time}</button>
                            </div>
                            }
                        </div> 
                    </div> 
                    
                </div>
              
            </div>
            <div id="recap-cont" className="recaptcha"></div>
        </div>
    );
}

export default Auth;