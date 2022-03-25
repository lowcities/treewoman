import React, { useState, useEffect } from 'react';
import Title from './comps/Title';
import Auth from './comps/Auth';
import UploadForm from './comps/UploadForm';
import ImageGrid from './comps/imageGrid';
import Modal from './comps/modal';
import Footer from './comps/Footer';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/config';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [clicked, setClicked ] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [caption, setCaption] = useState(null);
  const [year, setYear] = useState(null);
  const [loginBtn, setLoginBtn] = useState("")
  const [currentUser, setCurrentUser] = useState("");

  


  onAuthStateChanged(auth, (user) => {
    if (user) {
      setAuthenticated(true);
      setClicked(false);
      setCurrentUser(user.email);
    } else {
      setAuthenticated(false);
      setCurrentUser("");
      
    }
  })

  const logout = async () => {
    await signOut(auth);
  };
  console.log(authenticated);
  
 return (
    <div className="App">
      { authenticated === true ?  <span className="login-btn" onClick={logout}>Logout: {currentUser}</span> 
      : <span className="login-btn" onClick={(e) => clicked === false ? setClicked(true) : setClicked(false)}>Login/SignUp</span>}
      <Title/>
      { clicked && <Auth /> }
      <UploadForm />
      <ImageGrid setSelectedImg={setSelectedImg} setCaption={setCaption} setYear={setYear} />
      { selectedImg && <Modal selectedImg={selectedImg} setSelectedImg={setSelectedImg} caption={caption} year={year} />}
      <Footer />
    </div>
  );
}

export default App;
