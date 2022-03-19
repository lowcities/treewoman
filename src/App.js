import React, { useState } from 'react';
import Title from './comps/Title';
import UploadForm from './comps/UploadForm';
import ImageGrid from './comps/imageGrid';
import Modal from './comps/modal';

function App() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [caption, setCaption] = useState(null);
  const [year, setYear] = useState(null);

  return (
    <div className="App">
      <Title/>
      <UploadForm />
      <ImageGrid setSelectedImg={setSelectedImg} setCaption={setCaption} setYear={setYear} />
      { selectedImg && <Modal selectedImg={selectedImg} setSelectedImg={setSelectedImg} caption={caption} year={year} />}
    </div>
  );
}

export default App;
