import React, { useState } from "react";
import { motion } from 'framer-motion';
import useFirestore from '../hooks/useFirestore';

const ImageCarousel = ({ setSelectedImg, setCaption, year }) => {
    const { docs } = useFirestore('images');
    const { currentPic, setCurrentPic } = useState(0);
    console.log(docs);
    const imageArray = [];
    docs.map(doc => imageArray.push(doc));
    console.log(imageArray);
    
    let photoIndex = 0;
    const nextPhoto = (e) => {
        // if( currentPic >= docs.length -1 ) {
        //     setCurrentPic(0);
        // } else {
        //     setCurrentPic(currentPic + 1);
        // }
    }

    const previousPhoto = (e) => {

    }

    console.log(currentPic);
     return (
         <motion.div className="carousel-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
         >
         <span className="left-arrow" onClick={previousPhoto}></span>
            <div className="photo-box">
                { docs.length > 0 ? 
                    <div className="photo-frame" key={imageArray[1]} style={{backgroundImage: `url(${docs[photoIndex].url})`}}></div>
                    : <div>Waiting</div>
                }
            </div>
            
            <span className="right-arrow" onClick={nextPhoto}></span>
            <h1 className='carousel-year'>{year}</h1>
         </motion.div>
     )
}

export default ImageCarousel;