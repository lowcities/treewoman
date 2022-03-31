import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPhoneNumber,
    onAuthStateChanged, RecaptchaVerifier, PhoneAuthProvider, sendEmailVerification, isEmailVerified, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { async } from "@firebase/util";

const Auth = ({ clicked, setClicked }) => {
    const countryCode = "+1";

    const [ registerEmail, setRegisterEmail ] = useState("");
    const [ registerPassword, setRegisterPassword ] = useState("");
    const [ registerPhone, setRegisterPhone ] = useState(countryCode);
    const [ loginEmail, setLoginEmail ] = useState("");
    const [ loginPassword, setLoginPassword ] = useState("");
    const [ reqEmail, setReqEmail ] = useState(false);
    const [ otpField, setOtpField ] = useState(false);
    const [ OTP, setOTP ] = useState();
    const [user, setUser] = useState({});
    const [ emailVerif, setEmailVerif ] = useState(true);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [time, setTime] = useState(60)
    const [timeActive, setTimeActive] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return () => {
            unsubscribe();
        }
    }, []);

    onAuthStateChanged(auth, (user) => {
        if(user && user.emailVerified === true) {   
            setEmailVerif(true);
        } else if(user && !user.emailVerified) {
            setEmailVerif(false);
        }
    });

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

    const generateRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier('recap-cont', {
            'size': 'invisible',
            'callback': (response) => {}
        }, auth);
    }

    const requestOTP = (e) => {
        e.preventDefault();
        if(registerPhone.length >= 12) {
            setOtpField(true);
            generateRecaptcha();
            let appVerifier = window.recaptchaVerifier;
            console.log(registerPhone);
            signInWithPhoneNumber(auth, registerPhone, appVerifier)
                .then(confirmationResult => {
                    window.confirmationResult = confirmationResult;
                }) 
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    const verifyOTP = (e) => {
        let otp = e.target.value;
        console.log(otp);
        setOTP(otp);
        if(otp.length === 6) {
            window.confirmationResult.confirm(otp).then((result) => {
                register();
                const user = result.user;
                console.log(result);
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    const register = async () => {
       
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
        
    };

    const login = async () => {
        try {
            const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            resetFields();
        } catch (error) {
            console.log(error.message);
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
        <div className="login-signup-form">
            <div className="login-html">
                    <input id="tab-1" type="radio" name="tab" className="sign-in" defaultChecked/>
                    <label htmlFor="tab-1" className="tab">Sign In</label>
                    <input id="tab-2" type="radio" name="tab" className="sign-up"/>
                    <label htmlFor="tab-2" className="tab">Sign Up</label>
                    
                <div className="login-form">
                    <div className="sign-in-htm">
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
                        { !emailVerif && 
                          <div className="group">
                              <label htmlFor="reqEmailLink" className="label" style={{textAlign: "center"}}>Your email is unverified</label>
                              <button id="reqEmail" className="button" style={{background: timeActive ? 'red' : '#1161ee'}} onClick={resendEmail} disabled={timeActive}>Send Email Link {timeActive && time}</button>
                              <button className="button" onClick={logout}>Logout session</button>
                          </div>
                        }
                        
                    </div> 
                    <div className="sign-up-htm">
                        <div class="group">
					        <label htmlFor="signUpEmail" className="label">Email</label>
					        <input id="signUpEmail" type="text" className="input" placeholder="Email..." onChange={(e) => setRegisterEmail(e.target.value)}/>
				        </div>
                        <div class="group">
					        <label htmlFor="phone" className="label">Phone Number</label>
					        <input id="phone" type="tel" value={registerPhone} className="input" placeholder="Phone Number..." onChange={(e) => setRegisterPhone(e.target.value)}/>
				        </div>
				        <div class="group">
					        <label htmlFor="signUpPass" className="label">Password</label>
					        <input id="signUpPass" type="password" className="input" data-type="password" placeholder="Password..." onChange={(e) => setRegisterPassword(e.target.value)}/>
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
                        
                        {/* <div className="group">
                            <button id="registerBtn" className="button" onClick={register}> Create User </button>
                        </div> */}
                    </div> 
                </div> 
                
            </div>
            <div id="recap-cont" className="recaptcha"></div>  
        </div>
    );
}

export default Auth;