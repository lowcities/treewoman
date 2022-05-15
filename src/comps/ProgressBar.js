import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import useStorage from '../hooks/useStorage';
import ImageCaption from './ImageCaption';
import {motion} from 'framer-motion';

import '../ProgressBar.css';


const ProgressBar = ({file, setFile}) => {
    const { url, progress } = useStorage(file);
    const [caption, setCaption] = useState(false);
    const [offset, setOffset] = useState(0);
    const circleRef = useRef(null);
    const size = 200;
    const strokeWidth = 15;
    const circleOneStroke = '#d9edfe'
    const circleTwoStroke = 'blue';
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
                if(caption) {
                    setFile(null);
                    setCaption(false);
                }
            }, [url, setFile, caption, setCaption])
    

    useEffect(() => {
        const progressOffset = ((100 - progress) / 100) * circumference;
        setOffset(progressOffset);

        circleRef.current.style = 'transition: stroke-dashoffset 850ms ease-in-out';

    }, [setOffset, progress, circumference, offset]);

    return (
        <div style={{padding: "1rem"}}>
            <div className='file-name'> { file.name }</div>
            <svg
                className="svg"
                width={size}
                height={size}
            >
                <circle
                    className="svg-circle-bg"
                    stroke={circleOneStroke}
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <circle
                    className="svg-circle"
                    ref={circleRef}
                    stroke={circleTwoStroke}
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
                <text 
                    x={`${center}`} 
                    y={`${center}`} 
                    className="svg-circle-text">
                        {Math.floor(progress)}%
                </text>
            </svg>
            {progress === 100 && <ImageCaption url={url} caption={caption} setCaption={setCaption}/>}
        </div>
    );
}

ProgressBar.propTypes = {
    size: PropTypes.number.isRequired,
    progress: PropTypes.number.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    circleOneStroke: PropTypes.string.isRequired,
    circleTwoStroke: PropTypes.string.isRequired
}



// const ProgressBar = ({ file, setFile }) => {
//     const [caption, setCaption] = useState(false);
//     const { url, progress } = useStorage(file);
//     console.log(progress, url);

//     useEffect(() => {
//         if(caption) {
//             setFile(null);
//             setCaption(false);
//         }
//     }, [url, setFile, caption, setCaption])

//     console.log(file, caption);
//     return (
//         <div>
//             {progress < 100 && <div className='progress-container'>
//                 <motion.div className="progress-bar"
//                     initial={{ width: 0 }}
//                     animate= {{ width: progress + '%' }}
//                 ></motion.div>
//             </div>}
//             {progress === 100 && <ImageCaption url={url} caption={caption} setCaption={setCaption}/>}
//         </div>
         
       
        
//     );
// };

export default ProgressBar;