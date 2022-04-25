import React from "react";
import { motion } from 'framer-motion';
import useFirestore from '../hooks/useFirestore';

const ImageGrid = ({ setSelectedImg, setCaption, setYear, setImgID }) => {
    const { docs } = useFirestore('images');
    console.log(docs);
   
     return (
        <div>
        <h2 className="sub-heading">Remembering and Celebrating the Life of Sarah Lucille Low</h2>
        <hr className='upload-divider'></hr>
            <div className="img-grid">
                { docs && docs.map(doc => (
                    <motion.div className="img-wrap" key={doc.id}
                        layout
                        whileHover={{ opacity: 1 }}
                        onClick={() => {
                            setSelectedImg(doc.url);
                            setCaption(doc.caption);
                            setYear(doc.dateOfImg);
                            setImgID(doc.id)}
                        }
                    >
                        <img src={doc.url} alt="sarahImage" />
                    </motion.div>
                ))}
            </div>
        </div>
       
    );
}

export default ImageGrid;