import React from "react";
import { motion } from 'framer-motion';
import useFirestore from '../hooks/useFirestore';

const ImageCarousel = ({ setSelectedImg, setCaption, setYear }) => {
    const { docs } = useFirestore('images');
    const imageArray = [];
    docs.map(doc => imageArray.push(doc));
    console.log(imageArray);
    
     return (
         <div className="carousel-container">
            <div className="photo-box">
                { docs && 
                    <div className="photo-frame" key={imageArray[1]} style={{backgroundImage: `url(${imageArray[1].url})`}}></div>
                }
            </div>
         </div>
     )
}

export default ImageCarousel;