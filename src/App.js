import React, { useState } from 'react';
import Title from './comps/Title';
import Auth from './comps/Auth';
import UploadForm from './comps/UploadForm';
import ImageGrid from './comps/imageGrid';
import Modal from './comps/modal';
import Footer from './comps/Footer';

function App() {
  const [clicked, setClicked ] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [caption, setCaption] = useState(null);
  const [year, setYear] = useState(null);

  return (
    <div className="App">
      <span className="login-btn" onClick={(e) => clicked === false ? setClicked(true) : setClicked(false)}>Login/SignUp</span>
      { clicked && <Auth /> }
      <Title/>
      <UploadForm />
      <ImageGrid setSelectedImg={setSelectedImg} setCaption={setCaption} setYear={setYear} />
      { selectedImg && <Modal selectedImg={selectedImg} setSelectedImg={setSelectedImg} caption={caption} year={year} />}
      <Footer />
    </div>
  );
}

export default App;
