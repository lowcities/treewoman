import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, 
    onAuthStateChanged, RecaptchaVerifier, multiFactor, sendEmailVerification, 
    PhoneAuthProvider, getMultiFactorResolver, PhoneMultiFactorGenerator, sendPasswordResetEmail, linkWithCredential, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { async } from "@firebase/util";

const Auth = ({ clicked, setClicked, setAuthenticated }) => {
    const countryCode = '+1';
    const [ userName, setUserName ] = useState("");
    const [ registerEmail, setRegisterEmail ] = useState("");
    const [ registerPassword, setRegisterPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const [ loginEmail, setLoginEmail ] = useState("");
    const [ loginPassword, setLoginPassword ] = useState("");
    const [ reqEmail, setReqEmail ] = useState(false);
    const [user, setUser] = useState({});
    const [ MFAEnrolled, setMFAEnrolled ] = useState(true);
    const [ emailVerif, setEmailVerif ] = useState(true);
    const [ userPhone, setUserPhone ] = useState(countryCode);
    const [ showOTP, setShowOTP ] = useState(false);
    const [ otpField, setOtpField ] = useState(false);
    const [ OTP, setOTP ] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [time, setTime] = useState(60);
    const [timeActive, setTimeActive] = useState(false);
    const [error, setError] = useState('');
    const [ validField, setValidField ] = useState(true);
    const [ verificationId, setVerificationId ] = useState('');
    const [ showResetForm, setShowResetForm ] = useState(false);

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

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
              let MFUser = multiFactor(auth.currentUser);
              console.log(MFUser);
              if(MFUser.enrolledFactors.length !== 0) {
                setMFAEnrolled(true);
              } else {
                setMFAEnrolled(false);
              }
            }
           
          });
    }, [])
    

    const generateRecaptcha = () => {
        console.log(window.recaptchaVerifier);
        if(window.recaptchaVerifier !== undefined) {
            window.recaptchaVerifier.clear();
            document.getElementById("recap-cont").innerHTML = `<div id="recap"></div>`;
        }
        window.recaptchaVerifier = new RecaptchaVerifier('recap', {
            'size': 'invisible',
            'callback': (response) => {
                console.log("captcha solved!");
            },
            'expired-callback': () => {
                console.log("recaptcha expired");
                
            }
            
           
        }, auth);
    }

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

    //REGISTER A NEW USER/////////////////////////
    const register = async () => {
        if(validateEmailAddress()) {
            if(validatePassword()) {
                try {
                    setReqEmail(true);
                    setButtonDisabled(true);
                    const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
                        .then((user) => {
                            updateProfile(auth.currentUser,{
                                displayName: userName
                            });
                            console.log(user);
                        })
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
//SET UP MULTIFACTOR ENROLLMENT FOR NEW USER BY SENDING SMS TO PHONE//////////////////////
    const createMFA = () => {
        setOtpField(true);
        if(auth.currentUser.emailVerified) {
            // if(userPhone === '+13333333333') {
            //     console.log("Access Denied");
            //     logout();
            // };
            const provider = new PhoneAuthProvider(auth);
            multiFactor(auth.currentUser).getSession()
                .then((multiFactorSession) => {
                    const phoneInfo = {
                        phoneNumber: userPhone,
                        session: multiFactorSession
                    };
                    generateRecaptcha();
                    let verifier = window.recaptchaVerifier
                    return provider.verifyPhoneNumber(phoneInfo, verifier);
                }).then((verificationId) => {
                    setVerificationId(verificationId);
                    // setOtpField(false);
                }, (error) => {
                    console.log(error);
                    setError(error);
                    
                    
                });
        } else {
            
            setEmailVerif(false);
            setMFAEnrolled(true);
            
            
        }
    }

//VERIFY OTP SENT TO PHONE COMPLETING MULTIFACTOR ENROLLMENT////////////////////
    const OTPAuth = (e) => {
        setError("");
        let code = e.target.value;
        setOTP(code);
        console.log(code);
        if(auth.currentUser && verificationId && code.length === 6) {
            const credential = PhoneAuthProvider.credential(verificationId, code)
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);
            multiFactor(auth.currentUser).enroll(multiFactorAssertion, 'phone-number')
                .then(() => {
                    setMFAEnrolled(true);
                    setOtpField(false);
                    setAuthenticated(true);
                    setClicked(false);
                    console.log("User MFA enrolled!");
                }, (error) => {
                    setError(error);
                    console.log("SMS error", error);
                    setOTP("");
                    
                    
                });
        }
    }


//LOGIN AN EXSISTING USER/////////////////////////////////
    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
        }   catch (error)  {
            if(error.code === 'auth/multi-factor-auth-required' ) {
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
        setShowOTP(true);        
        console.log("Code sent!");               
    };

    //VERIFY OTP FOR USER LOGIN//////////////////////////////////////////
    const verifyOTP = async (e) => {
        let otp = e.target.value;
        console.log(otp);
        setOTP(otp);
        if(otp.length === 6) {
            const cred = PhoneAuthProvider.credential(window.verificationId, otp);
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
            try {
                const credential = await window.resolver.resolveSignIn(multiFactorAssertion);
                setClicked(false);
                console.log(credential);
            } catch (error) {
                console.log(error);
                setError(error);
                setOTP("");
            }
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

    
    const resetPassword = (e) => {
        e.preventDefault();
        sendPasswordResetEmail(auth, loginEmail)
            .then(() => {
                console.log("Email Sent!");
                setShowResetForm(false);
            })
            .catch((error) => {
                console.log(error);
            })
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
                    <span className="close-form-btn" onClick={(e) => clicked === false ? setClicked(true) : setClicked(false)}></span>
                        <input id="tab-1" type="radio" name="tab" className="sign-in" defaultChecked/>
                        <label htmlFor="tab-1" className="tab">Sign In</label>
                        <input id="tab-2" type="radio" name="tab" className="sign-up"/>
                        <label htmlFor="tab-2" className="tab">Sign Up</label>
                        
                    <div className="login-form">
                        { !showResetForm && <div className="sign-in-htm">
                            { MFAEnrolled && <div>
                                { !showOTP && <div>
                                    <div className="group">
                                        <label htmlFor="email" className="label">Email</label>
                                        <input id="email" placeholder="Email..." className="input" onChange={(e) => setLoginEmail(e.target.value)}/>
                                    </div>
                                    <div className="group">
                                        <label htmlFor="pass" className="label">Password</label>
                                        <input id="pass" type="password" placeholder="Password..." className="input" data-type="password" onChange={(e) => setLoginPassword(e.target.value)}/>
                                        <button id="resetPass" className="resetPassLink" type="button" onClick={(e) => {e.preventDefault(); setShowResetForm(true)}}>Forgot Password?</button>
                                    </div>
                                    <div className="group">
                                        <button className="form-login-btn button" onClick={login}>Login</button>
                                    </div>
                                </div>}
                                { showOTP && <div className="group">
                                <hr className="login-divider"></hr>
                                    <p className="verify-caption">Please enter the passcode we just sent you</p>
                                    <hr className="login-divider"></hr>
                                    <label htmlFor="OTP" className="label">Passcode</label>
                                    <input id="OTP" type="number" value={OTP} className="input" placeholder="Passcode..." onChange={verifyOTP}/>
                                    {error && <div><span style={{color: 'red'}}>{error.code}</span>
                                        <button className="button" onClick={login}>RESEND PASSCODE</button></div>}
                                        <button className="button" onClick={logout}>Logout session</button>
                                 </div> 
                                 
                                 }
                                    
                            </div>}
                            { !emailVerif && 
                            <div className="group">
                                <label htmlFor="reqEmailLink" className="label" style={{textAlign: "center"}}>Your email is unverified</label>
                                <button id="reqEmail" className="button" style={{background: timeActive ? 'red' : '#1161ee'}} onClick={resendEmail} disabled={timeActive}>Send Email Link {timeActive && time}</button>
                                <button className="button" onClick={logout}>Logout session</button>
                            </div>}
                            {!MFAEnrolled &&  
                                <div className="group">
                                    <hr className="login-divider"></hr>
                                    <p className="verify-caption">Please verify your phone number to complete signup</p>
                                    <hr className="login-divider"></hr>
                                    <label htmlFor="phone" className="label">Phone Number</label>
                                    <input id="phone" type="tel" value={userPhone} className="input" placeholder="Phone Number..." onChange={(e) => setUserPhone(e.target.value)}/>
                                        { otpField === true  ? 
                                            <div className="group">
                                                <label htmlFor="OTP" className="label">Passcode</label>
                                                <input id="OTP" type="number" value={OTP} className="input" placeholder="Passcode..." onChange={OTPAuth}/>
                                            </div> 
                                            : <button className="button" style={{background: timeActive ? 'red' : '#1161ee'}} onClick={createMFA} disabled={timeActive}>Request Passcode {timeActive && time}</button>}
                                            {error && <div><span className="error-msg" style={{color: 'red'}}>{error.code}</span>
                                                <button className="button" style={{marginTop: "15px"}} onClick={createMFA}>RESEND PASSCODE</button></div>}  
                                                <button className="button" onClick={logout}>Logout session</button>
                                                  
                                            </div>
                                            
                                        }
                                        
                                        
                        </div>}
                        { showResetForm && 
                            <div className="group password-reset-form">
                                <label htmlFor="email" className="label">Enter the email address you signed up with</label>
                                <input id="email" placeholder="Email..." className="input" onChange={(e) => setLoginEmail(e.target.value)}/>
                                <button id="resetPass" className="button" onClick={resetPassword} >Reset Password</button>
                            </div>} 
                        <div className="sign-up-htm">
                            <div className="group">
                                <label htmlFor="username" className="label">User name</label>
                                <input id="username" type="text" className="input" placeholder="Username..." style={fieldStyle} onChange={(e) => setUserName(e.target.value)}/>
                            </div>
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
                                <label htmlFor="reqEmailLink" className="label" style={{color: '#5d5656', fontWeight: 800, border: "2px solid red", textAlign: "center" }}>Please Check your Email for verification link</label>
                                <button id="reqEmail" className="button req-email-btn" style={{opacity: timeActive ? 0 : 1 }} onClick={resendEmail} disabled={timeActive}>Resend Email {timeActive && time}</button>
                            </div>
                            }
                        </div> 
                    </div> 
                    
                </div>
              
            </div>
            <div id="recap-cont" >
                <div id="recap"></div>
            </div>
            
        </div>
    );
}

export default Auth;