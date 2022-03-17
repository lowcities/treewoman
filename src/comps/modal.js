import React from 'react';
import { motion } from 'framer-motion';

const Modal = ({ selectedImg, setSelectedImg }) => {
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
            <motion.img src={selectedImg} alt="enlarged pic"
                initial={{ scale: 0, y: "-100vh" }}
                animate= {{ scale: 1, y: "0" }}
                transition={{ delay: .5, type: "spring" }}
             />
        </motion.div>
    );
}

export default Modal;
