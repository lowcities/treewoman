import React, {useEffect, useState} from 'react';
import { motion } from 'framer-motion';
import AddComment from './AddComment'
import useFirestore from '../hooks/useFirestore';

const Modal = ({ selectedImg, setSelectedImg, caption, year, imgID, authenticated }) => {
    // const { docs } = useFirestore('images');
    const { docs } = useFirestore(`images/${imgID}/comments`);
    const [captionShow, setCaptionShow] = useState(false);
    const [ addCaption, setAddCaption ] = useState(false);
    const [ error, setError ] = useState("");
    console.log(selectedImg);
    console.log(imgID);

    const handleClick = (e) => {
        if(e.target.classList.contains('backdrop')) {
            setSelectedImg(null);
            }
        }
        
        
    const showComment = (e) => {
        let commentBox = document.getElementById('captionBox')
        if(commentBox.classList.contains('show-comments')) {
            commentBox.classList.remove('show-comments');
        } else {
            commentBox.classList.add('show-comments');
        }
    }
        
    return (
        <motion.div className='backdrop' onClick={handleClick} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            { authenticated && <span className='caption-btn' onClick={(e) => addCaption ? setAddCaption(false) : setAddCaption(true)}>ADD COMMENT</span>}
            { addCaption && <AddComment selectedImg={selectedImg} setAddCaption={setAddCaption}/>}
            <div className="caption-switch-container">
                <label htmlFor="captionBtn" className="caption-switch-label">COMMENTS</label>
                <input className="caption-switch" id="captionBtn" type="checkbox" onChange={showComment} />
            </div>
            <motion.img src={selectedImg} alt="enlarged pic" 
                initial={{ scale: 0, y: "-100vh" }}
                animate= {{ scale: 1, y: "0" }}
                transition={{ delay: .5, type: "spring",stiffness: 100, damping: 20  }}
             />
                <h1 className='year'>{year}</h1>
                
                
                <motion.div className='caption-box' id='captionBox'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                <div className='caption-container'>
                    <div className='blurred'></div>
                        <div className='post-blur-cont'>
                            <p className='caption'>{caption}</p>
                            { docs && docs.map(item => (
                                <div>
                                    <div className="comment-container" key={item.id}>
                                    <span className='user'>{item.user}</span>
                                    <h1 className='comment'>{item.userComment}</h1>
                                    
                                </div>
                                <span className='comment-date' key={item.createdAt}>{item.createdAt}</span>
                            </div>
                            ))}    
                        </div>
                        
                    
                </div>
            </motion.div> 
            <div>
                
            </div>
            
                
           
        </motion.div>
        
    );
}

export default Modal;
