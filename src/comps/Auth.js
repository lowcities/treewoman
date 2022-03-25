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
            <div>
                <h3> Register User </h3>
                <input placeholder="Email..." onChange={(e) => setRegisterEmail(e.target.value)}/>
                <input placeholder="Password..." onChange={(e) => setRegisterPassword(e.target.value)}/>

                <button onClick={register}> Create User </button>
            </div>
            <div>
                <h3> Login </h3>
                <input placeholder="Email..." onChange={(e) => setLoginEmail(e.target.value)}/>
                <input placeholder="Password..." onChange={(e) => setLoginPassword(e.target.value)}/>
                <button onClick={login}>Login</button>
            </div>
            <h4> User Logged In: </h4>
                {user?.email}

            
        </div>
    );
}

export default Auth;