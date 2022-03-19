import React from "react";
import { motion } from 'framer-motion';
import useFirestore from '../hooks/useFirestore';

const ImageGrid = ({ setSelectedImg, setCaption, setYear }) => {
    const { docs } = useFirestore('images');
    console.log(docs);
    
    
    return (
        <div className="img-grid">
            { docs && docs.map(doc => (
                <motion.div className="img-wrap" key={doc.id}
                    layout
                    whileHover={{ opacity: 1 }}
                    onClick={() => {
                        setSelectedImg(doc.url);
                        setCaption(doc.caption);
                        setYear(doc.dateOfImg);}
                    }
                >
                    <img src={doc.url} alt="sarahImage" />
                </motion.div>
            ))}
        </div>
       
    );
}

export default ImageGrid;