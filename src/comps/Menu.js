import React, {useState, useEffect } from "react";
import { motion } from 'framer-motion';
import UploadForm from "./UploadForm";
import Auth from "./Auth";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/config'

const Menu = ({ authenticated, setAuthenticated }) => {
    const [ menuActive, setMenuActive ] = useState(false);
    const [ clicked, setClicked ] = useState(false);
    const [ currentUser, setCurrentUser ] = useState("");

    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setCurrentUser);
        return () => {
            unsubscribe();
        }
      }, []);

    useEffect(() => {
        let menuButton = document.getElementById('menuButton');
        if(menuActive === true) {
            menuButton.innerHTML = 'CLOSE';
        } else {
            menuButton.innerHTML = 'MENU';
        }
      }, [menuActive]);

      const logout = async () => {
        setCurrentUser(null);
        setClicked(false);
        await signOut(auth);
      };

    return (
        <div>
            <motion.ul className="menu">
                <motion.li className="menu-element menu-button" id="menuButton" onClick={(e) => menuActive === true ? setMenuActive(false) : setMenuActive(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                    ></motion.li>
                { menuActive && <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}>
                 { authenticated === true ? <li className="logout-btn li-space" onClick={logout}>LOG<br></br>OUT</li>
                 : <li className="login-btn li-space" onClick={(e) => clicked === false ? setClicked(true) : setClicked(false)}>LOGIN</li>}
                    </motion.div>}
            { clicked && <Auth clicked={clicked} setClicked={setClicked} setAuthenticated={setAuthenticated} />} 
             { menuActive && <motion.li className="li-space upload-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
             ><UploadForm currentUser={currentUser} />ADD<br></br>PHOTO</motion.li>}
            </motion.ul>
        </div>
    )
}


export default Menu;