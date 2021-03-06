import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import useFirestore from '../hooks/useFirestore';

const ImageCarousel = ({ setSelectedImg, setCaption }) => {
    const { docs } = useFirestore('images');
    const [ currentPic, setCurrentPic ] = useState(0);
    const [ index, setIndex ] = useState(0);
    const [ year, setYear ] = useState(null);
    const [ autoPlayOn, setAutoPlayOn ] = useState(false);
    const imageArray = [];
    docs.map(doc => imageArray.push(doc));
    imageArray.sort(function(a,b) {
        return parseInt(a.dateOfImg) - parseInt(b.dateOfImg);
    })
    
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
    }, [docs, index])
    
    useEffect(() => {
        if(autoPlayOn) {
        const interval = setInterval(nextPhoto, 4000);
        return () => clearInterval(interval);
        } else {
            return () => clearInterval(interval);
        }
        
    }, [autoPlayOn, index, interval])

    console.log(currentPic);
     return (
         <motion.div className="carousel-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
         >
            {autoPlayOn && <motion.div className='autoplay-notification'
                initial={{ scale: 0, y: "-100vh" }}
                animate= {{ scale: 1, y: "0" }}
                transition={{ delay: .5, type: "spring",stiffness: 100, damping: 20  }}
            >AutoPlay On</motion.div>}
            <div className="autoplay-switch">
            <label htmlFor="slideshow" className="play-label"></label>
                <input className="autoplay" id="slideshow" type="checkbox" onChange={changeHandler} />
            </div>
            
            <div className="photo-box">
                <div className="carousel-mandala"></div>
            
                { docs && imageArray.map(pic => (
                    <div className="photo-frame" key={pic.id} style={{backgroundImage: `url(${pic.url})`}}>
                        <h1 className="carousel-year">{pic.dateOfImg}</h1>
                    </div>
                    
                ))}
                <span className="arrow left-arrow" onClick={previousPhoto}></span>
            <span className=" arrow right-arrow" onClick={nextPhoto}></span>
            </div>
            
            
         </motion.div>
     )
}

export default ImageCarousel;