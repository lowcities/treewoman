import { useState, useEffect } from 'react';
import { projectStorage } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const useStorage  = (file) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    
    
    useEffect(() => {
        // references
        const metadata = {
            contentType: 'image/jpeg'
          };
        const storageRef = ref(projectStorage, file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);
        
        console.log(storageRef);

        uploadTask.on('state_changed', (snap) => {
            let progress = (snap.bytesTransferred / snap.totalBytes) * 100;
            setProgress(progress);
            console.log(progress);
        }, (err) => {
            setError(err);
        }, async () => {
            
            let url = getDownloadURL(uploadTask.snap.ref).then((downloadURL) => {
                console.log(downloadURL);
            });
            setUrl(url);
        })
    }, [file]);

    return { progress, url, error }
}

export default useStorage;