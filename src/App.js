import React, { useState, useEffect } from 'react';
import Title from './comps/Title';
import Auth from './comps/Auth';
import UploadForm from './comps/UploadForm';
import ImageGrid from './comps/imageGrid';
import Modal from './comps/modal';
import Footer from './comps/Footer';
import { onAuthStateChanged, multiFactor, signOut } from 'firebase/auth';
import { auth } from './firebase/config';
import PhoneAuth from './comps/PhoneAuth';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [clicked, setClicked ] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [caption, setCaption] = useState(null);
  const [year, setYear] = useState(null);
  const [loginBtn, setLoginBtn] = useState("")
  const [currentUser, setCurrentUser] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(true);
  
  onAuthStateChanged(auth, (user) => {
    if(user) {
      let MFUser = multiFactor(auth.currentUser);
      console.log(MFUser);
      if(MFUser.enrolledFactors.length !== 0) {
        setAuthenticated(true);
        setPhoneVerified(true);
        setClicked(false);
        setCurrentUser(user);
      } else if(user.emailVerified && !user.phoneNumber) {
        setPhoneVerified(false);
        setClicked(false);
      }
    } else {
      setAuthenticated(false);
      setPhoneVerified(true);
      setCurrentUser("");
    }
  })

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
        { !phoneVerified && <PhoneAuth currentUser={currentUser} /> }
        <UploadForm />
        <ImageGrid setSelectedImg={setSelectedImg} setCaption={setCaption} setYear={setYear} />
        { selectedImg && <Modal selectedImg={selectedImg} setSelectedImg={setSelectedImg} caption={caption} year={year} />}
        <Footer />
      
    </div>
  );
}

export default App;
