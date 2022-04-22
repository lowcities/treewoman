import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import useFirestore from '../hooks/useFirestore';
import ToggleSwitch from "./ToggleSwitch";

const ImageCarousel = ({ setSelectedImg, setCaption, year }) => {
    const { docs } = useFirestore('images');
    const [ currentPic, setCurrentPic ] = useState(0);
    const [ index, setIndex ] = useState(0);
    const [ autoPlayOn, setAutoPlayOn ] = useState(false);
    const imageArray = [];
    docs.map(doc => imageArray.push(doc));
    
    
    console.log(imageArray);
    
    
    let frame = document.querySelector('.photo-frame');
    const nextPhoto = (e) => {
        if(index >= docs.length -1) {
            setIndex(0);
        } else {
            setIndex((prevIndex) => prevIndex + 1);
            console.log(index);
        }
        imageVisible(index);
    }

    const previousPhoto = (e) => {
        if(index === 0) {
            setIndex(imageArray.length - 1);
        } else {
            setIndex((prevIndex) => prevIndex - 1);
            console.log(index);
        }
        imageVisible(index);
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
        return autoPlayOn ? setAutoPlayOn(false) : setAutoPlayOn(true);
    }

    useEffect(() => {
        imageVisible(index);
        console.log("effect");
    }, [docs])
    
    useEffect(() => {
        if(autoPlayOn) {
        const interval = setInterval(nextPhoto, 4000);
        return () => clearInterval(interval);
        } else {
            return () => clearInterval(interval);
        }
        
    }, [autoPlayOn, index])

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