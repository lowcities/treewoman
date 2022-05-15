import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';


const UploadForm = ({ currentUser }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const types = ['image/png', 'image/jpeg'];

    const changeHandler = (e) => {
        let selected = e.target.files[0];
        if(currentUser) {
            if (selected && types.includes(selected.type)) {
                setFile(selected);
                setError('');
            } else {
                setFile(null);
                setError('Please select an image file (png or jpeg)');

            }
        } else {
            setError('You must be logged in to upload');  
        }
    }
    let timer;
    useEffect(() => {
        if(error) {
        timer = setTimeout(() => setError(null), 4000);
        return () => clearTimeout(timer);
        } else {
            return () => clearTimeout(timer);
        }
        
    }, [error])

    return (
        <div>
            <form>
                <label className='upload-label'>
                    <input type='file' onChange={changeHandler} />
                    
                </label>
           
            
            </form>
            <div className='output'>
                { error && <div className='error'>{ error }</div> }
                { file && <ProgressBar file={file} setFile={setFile} />}
                
             </div>
         </div>   
    )
}

export default UploadForm ;