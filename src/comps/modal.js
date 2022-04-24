import React, {useState} from 'react';
import { motion } from 'framer-motion';
import AddComment from './AddComment'

const Modal = ({ selectedImg, setSelectedImg, caption, year }) => {
    const [captionShow, setCaptionShow] = useState(false);
    const [ addCaption, setAddCaption ] = useState(false);
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
            <span className='caption-btn' onClick={(e) => addCaption ? setAddCaption(false) : setAddCaption(true)}>ADD CAPTION</span>
            { addCaption && <AddComment selectedImg={selectedImg} setAddCaption={setAddCaption}/>}
            <div className="caption-switch-container">
                <label htmlFor="captionBtn" className="caption-switch-label">CAPTION</label>
                <input className="caption-switch" id="captionBtn" type="checkbox" onChange={(e) => captionShow === false ? setCaptionShow(true) : setCaptionShow(false)} />
            </div>
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
                        <div className='post-blur-cont'>
                            <p className='caption'>{caption}</p>
                        </div>
                    
                </div>
                
                
            </motion.div> }
            
                
           
        </motion.div>
        
    );
}

export default Modal;
