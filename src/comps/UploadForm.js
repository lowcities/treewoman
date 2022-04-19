import React, { useState } from 'react';
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

    return (
        <div>
            <form>
                <label className='upload-label'>
                    <input type='file' onChange={changeHandler} />
                    <span>ADD<br></br>PHOTO</span>
                </label>
           
            
            </form>
            <div className='output'>
                { error && <div className='error'>{ error }</div> }
                { file && <div style={{textAlign: "center", fontWeight:"bolder", fontSize: "2rem"}}> { file.name }</div> }
                { file && <ProgressBar file={file} setFile={setFile} />}
                
             </div>
         </div>   
    )
}

export default UploadForm ;