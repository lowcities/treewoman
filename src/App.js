import React, { useState, useEffect, useCallback } from 'react';
import Title from './comps/Title';
import Menu from './comps/Menu';
import UploadForm from './comps/UploadForm';
import ToggleSwitch from './comps/ToggleSwitch';
import ImageGrid from './comps/imageGrid';
import ImageCaption from './comps/ImageCaption';
import ImageCarousel from './comps/ImageCarousel';
import Modal from './comps/modal';
import Footer from './comps/Footer';
import { onAuthStateChanged, multiFactor, signOut } from 'firebase/auth';
import { auth } from './firebase/config';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [clicked, setClicked ] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [ caption, setCaption ] = useState("");
  const [ gridMode, setGridMode ] = useState(true);
  const [year, setYear] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(true);
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user) {
        setCurrentUser(user);
        let MFUser = multiFactor(auth.currentUser);
        console.log(MFUser);
        if(MFUser.enrolledFactors.length !== 0) {
          console.log("enrolled");
          setAuthenticated(true);
          setPhoneVerified(true);
          setCurrentUser(user);
        } else if(user.emailVerified && !user.phoneNumber) {
          setPhoneVerified(false);
        }
      } else {
        setAuthenticated(false);
        setCurrentUser(null);
      }
    });

  }, [])
  
  const picLayout = useCallback((gridMode) => {
    setGridMode(gridMode);
  }, []);

  const logout = async () => {
    setCurrentUser(null);
    setClicked(false);
    await signOut(auth);
  };

  
  console.log(authenticated);
  
 return (
    <div className="App">
      <ToggleSwitch parentCallback={picLayout} />
      <Menu authenticated={authenticated} setAuthenticated={setAuthenticated} />
      {authenticated && <div className='welcome-box'>Welcome {auth.currentUser.displayName}!</div>}
      <Title/>
      
      {gridMode && <ImageGrid setSelectedImg={setSelectedImg} setCaption={setCaption} setYear={setYear} />}
      {!gridMode && <ImageCarousel setSelectedImg={setSelectedImg} setCaption={setCaption} year={year} />}
      { selectedImg && <Modal selectedImg={selectedImg} setSelectedImg={setSelectedImg} caption={caption} year={year} />}
        <Footer />
    </div>
  );
}

export default App;
