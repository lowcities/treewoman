import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,
    onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

const Auth = () => {
    const [ registerEmail, setRegisterEmail ] = useState("");
    const [ registerPassword, setRegisterPassword ] = useState("");
    const [ loginEmail, setLoginEmail ] = useState("");
    const [ loginPassword, setLoginPassword ] = useState("");

    const [user, setUser] = useState({});

    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });

    const resetFields = () => {
        Array.from(document.querySelectorAll('input').forEach(input => (input.value = "")));
    } 

    const register = async () => {
        try {
            const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
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
            console.log(user);
        } catch (error) {
            console.log(error.message);
        }
    }

   
    

    return (
        <div className="login-signup-form">
            <div className="login-html">
                    <input id="tab-1" type="radio" name="tab" className="sign-in" defaultChecked/>
                    <label htmlFor="tab-1" className="tab">Sign In</label>
                    <input id="tab-2" type="radio" name="tab" className="sign-up"/>
                    <label htmlFor="tab-2" class="tab">Sign Up</label>
                    
                <div className="login-form">
                    <div className="sign-in-htm">
                        <div className="group">
                            <label htmlFor="email" class="label">Email</label>
                            <input id="email" placeholder="Email..." className="input" onChange={(e) => setLoginEmail(e.target.value)}/>
                        </div>
                        <div className="group">
                            <label htmlFor="pass" className="label">Password</label>
                            <input id="pass" type="password" placeholder="Password..." className="input" data-type="password" onChange={(e) => setLoginPassword(e.target.value)}/>
                         </div>
                        <div className="group">
                            <button className="button" onClick={login}>Login</button>
                        </div>
                    </div> 
                    <div className="sign-up-htm">
                        <div class="group">
					        <label htmlFor="user" class="label">Username</label>
					        <input id="user" type="text" className="input" placeholder="Email..." onChange={(e) => setRegisterEmail(e.target.value)}/>
				        </div>
				        <div class="group">
					        <label for="loginPass" class="label">Password</label>
					        <input id="loginPass" type="password" className="input" data-type="password" placeholder="Password..." onChange={(e) => setRegisterPassword(e.target.value)}/>
				        </div>
                        <div className="group">
                            <button className="button" onClick={register}> Create User </button>
                        </div>
                    </div> 
                </div>   
            </div>
        </div>
    );
}

export default Auth;