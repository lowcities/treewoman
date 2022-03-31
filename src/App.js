import React, { useState, useEffect } from 'react';
import Title from './comps/Title';
import Auth from './comps/Auth';
import UploadForm from './comps/UploadForm';
import ImageGrid from './comps/imageGrid';
import Modal from './comps/modal';
import Footer from './comps/Footer';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/config';
import { AuthProvider } from './AuthContext';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [clicked, setClicked ] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [caption, setCaption] = useState(null);
  const [year, setYear] = useState(null);
  const [loginBtn, setLoginBtn] = useState("")
  const [currentUser, setCurrentUser] = useState("");
  const [timeActive, setTimeActive] = useState(false)

  onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
      setAuthenticated(true);
      setClicked(false);
      setCurrentUser(user);
    } else {
      setAuthenticated(false);
      setCurrentUser("");
      
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setCurrentUser);
    return () => {
        unsubscribe();
    }
}, []);
  const logout = async () => {
    await signOut(auth);
  };
  console.log(authenticated);
  
 return (
    <div className="App">
      
        { authenticated === true ?  <span className="login-btn" onClick={logout}>Logout: {currentUser.email}</span> 
        : <span className="login-btn" onClick={(e) => clicked === false ? setClicked(true) : setClicked(false)}>Login/SignUp</span>}
        <Title/>
        { clicked && <Auth clicked={clicked} setClicked={setClicked} /> }
        <UploadForm />
        <ImageGrid setSelectedImg={setSelectedImg} setCaption={setCaption} setYear={setYear} />
        { selectedImg && <Modal selectedImg={selectedImg} setSelectedImg={setSelectedImg} caption={caption} year={year} />}
        <Footer />
      
    </div>
  );
}

export default App;
