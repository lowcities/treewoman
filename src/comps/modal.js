import React, {useState} from 'react';
import { motion } from 'framer-motion';

const Modal = ({ selectedImg, setSelectedImg, caption, year }) => {
    const [captionShow, setCaptionShow] = useState(false);
     console.log(selectedImg);
        const handleClick = (e) => {
            if(e.target.classList.contains('backdrop')) {
            setSelectedImg(null);
            }
        }

        

    return (
        
        <motion.div className='backdrop' onClick={handleClick} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <span className='caption-btn' onClick={(e) => captionShow === false ? setCaptionShow(true) : setCaptionShow(false) }>CAPTION</span>
            <motion.img src={selectedImg} alt="enlarged pic" 
                initial={{ scale: 0, y: "-100vh" }}
                animate= {{ scale: 1, y: "0" }}
                transition={{ delay: .5, type: "spring" }}
             />
             
                <h1 className='year'>{year}</h1>
                { captionShow && 
                <motion.div className='caption-box'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                <div className='caption-container'>
                    <div className='blurred'></div>
                        <div className='another-div'>
                            <p className='caption'>{caption}</p>
                        </div>
                    
                </div>
                
                
            </motion.div> }
            
                
           
        </motion.div>
        
    );
}

export default Modal;
