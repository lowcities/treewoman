import React, {useEffect, useState} from 'react';
import { motion } from 'framer-motion';
import AddComment from './AddComment'
import useFirestore from '../hooks/useFirestore';
import { db } from "../firebase/config";
import { Firestore, query, getDocs, collection, onSnapshot } from 'firebase/firestore';

const Modal = ({ selectedImg, setSelectedImg, caption, year, imgID }) => {
    // const { docs } = useFirestore('images');
    const { docs } = useFirestore(`images/${imgID}/comments`);
    const [captionShow, setCaptionShow] = useState(false);
    const [ addCaption, setAddCaption ] = useState(false);
    const [ error, setError ] = useState("");
     console.log(selectedImg);
    console.log(imgID);
     let imageRef;
     docs.map(doc => {
        console.log(doc);
    });

    

    const handleClick = (e) => {
        if(e.target.classList.contains('backdrop')) {
            setSelectedImg(null);
            }
        }
    
    let commentArray = [];    
    //    useEffect(() => {
    //     const q = query(collection(db, `images/${imageRef}/comments`));   
        
    //     const unsub = onSnapshot(q, (snapshot) => {
    //             let documents = [];
    //             snapshot.forEach(doc => {
    //                 commentArray.push({...doc.data(),id: doc.id});
    //             });
    //             console.log(commentArray[1]);
    //     })
    //     return () => unsub();

    //    }, [addCaption])
            
             
          console.log(commentArray[0]);
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
                            { docs && docs.map(item => (
                            <div className="comment-container" key={item.id}>
                                <h1 className='comment'>{item.userComment}</h1>
                                <span className='user'>{item.user}</span>
                            </div>
                            ))}    
                        </div>
                        
                    
                </div>
            </motion.div> }
            <div>
                
            </div>
            
                
           
        </motion.div>
        
    );
}

export default Modal;
