import React, {useState, useEffect } from "react";
import { motion } from 'framer-motion';
import UploadForm from "./UploadForm";
import Auth from "./Auth";
import { onAuthStateChanged, multiFactor, signOut } from 'firebase/auth';
import { auth } from '../firebase/config'

const Menu = ({ authenticated, setAuthenticated }) => {
    const [ menuActive, setMenuActive ] = useState(false);
    const [clicked, setClicked ] = useState(false);
    const [ currentUser, setCurrentUser ] = useState("");

    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setCurrentUser);
        return () => {
            unsubscribe();
        }
      }, []);

      const logout = async () => {
        setCurrentUser(null);
        setClicked(false);
        await signOut(auth);
      };

    return (
        <div>
            <motion.ul className="menu">
                <motion.li className="menu-element menu-button" onClick={(e) => menuActive === true ? setMenuActive(false) : setMenuActive(true)}
                initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
                    ><span>MENU</span></motion.li>
                { menuActive && <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}>
                 { authenticated === true ? <li className="logout-btn li-space" onClick={logout}><span>LOG<br></br>OUT</span></li>
                 : <li className="login-btn li-space" onClick={(e) => clicked === false ? setClicked(true) : setClicked(false)}><span>LOGIN</span></li>}
                    </motion.div>}

                {/* { authenticated === true ?  <span className="login-btn" onClick={logout}>Logout: {auth.currentUser.displayName} </span> 
            : <span className="login-btn" onClick={(e) => clicked === false ? setClicked(true) : setClicked(false)}>Login/SignUp</span>} */}
            { clicked && <Auth setClicked={setClicked} setAuthenticated={setAuthenticated} />} 
             { menuActive && <motion.li className="li-space upload-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
             ><UploadForm /></motion.li>}
            </motion.ul>
        </div>
    )
}


export default Menu;