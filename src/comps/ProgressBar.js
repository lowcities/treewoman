import React, { useEffect, useState } from 'react';
import useStorage from '../hooks/useStorage';
import ImageCaption from './ImageCaption';
import {motion} from 'framer-motion';

const ProgressBar = ({ file, setFile }) => {
    const [caption, setCaption] = useState(false);
    const { url, progress } = useStorage(file);
    console.log(progress, url);

    useEffect(() => {
        if(caption) {
            setFile(null);
            setCaption(false);
        }
    }, [url, setFile, caption, setCaption])

    console.log(file, caption);
    return (
        <div className='container'>
            {progress < 100 && <div className='progress-container'>
                <motion.div className="progress-bar"
                    initial={{ width: 0 }}
                    animate= {{ width: progress + '%' }}
                ></motion.div>
            </div>}
            {progress === 100 && <ImageCaption url={url} caption={caption} setCaption={setCaption}/>}
        </div>
         
       
        
    );
};

export default ProgressBar;