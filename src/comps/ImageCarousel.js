import React, { useState } from "react";
import { motion } from 'framer-motion';
import useFirestore from '../hooks/useFirestore';
import ToggleSwitch from "./ToggleSwitch";

const ImageCarousel = ({ setSelectedImg, setCaption, year }) => {
    const { docs } = useFirestore('images');
    const [ currentPic, setCurrentPic ] = useState(0);
    const [ autoPlayOn, setAutoPlayOn ] = useState(false);
    console.log(docs);
    const imageArray = [];
    docs.map(doc => imageArray.push(doc));
    console.log(imageArray);
    
    let photoIndex = 0;
    let frame = document.querySelector('.photo-frame');
    const nextPhoto = (e) => {
        if(photoIndex >= docs.length -1) {
            photoIndex = 0;
        } else {
            photoIndex++;
            console.log(photoIndex);
        }
        imageVisible(photoIndex);
    }

    const previousPhoto = (e) => {
        if(photoIndex === 0) {
            photoIndex = imageArray.length - 1;
        } else {
            photoIndex --;
            console.log(photoIndex);
        }
        console.log(photoIndex);
        imageVisible(photoIndex);
    }

    const imageVisible = (value) => {
        let images = document.querySelectorAll('.photo-frame');
        let current = images[value];
        for(let i = 0; i < images.length; i++) {
            if(i === value) {
                current.classList.add('active');
            } else {
                images[i].classList.remove('active');
            }
        }

    }

    
   let interval;
    const changeHandler = (e) => {
        clearInterval(interval);
       
       if(document.querySelector('.autoplay').checked) {
           interval = setInterval(nextPhoto, 3000);
       } else {
           clearInterval(interval);
       }
    }

    console.log(currentPic);
     return (
         <motion.div className="carousel-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
         >
            <span className="left-arrow" onClick={previousPhoto}></span>
            <div className="autoplay-switch">
                <label htmlFor="slideshow" className="play-label"></label>
                <input className="autoplay" id="slideshow" type="checkbox" onChange={changeHandler} />
            </div>
            <div className="photo-box">
                { docs && imageArray.map(pic => (
                    <div className="photo-frame" key={pic.id} style={{backgroundImage: `url(${pic.url})`}}></div>
        
                ))}
            </div>
            
            <span className="right-arrow" onClick={nextPhoto}></span>
            <h1 className='carousel-year'>{year}</h1>
         </motion.div>
     )
}

export default ImageCarousel;