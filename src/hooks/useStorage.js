import { useState, useEffect } from 'react';
import { projectStorage, db, timestamp } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc} from 'firebase/firestore';

const useStorage  = (file) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    
    
    useEffect(() => {
        // references
        // const metadata = {
        //     contentType: 'image/jpeg'
        //   };
        const storageRef = ref(projectStorage, file.name);
        const collectionRef = collection(db, 'images');
        

        const uploadTask = uploadBytesResumable(storageRef, file);
        
        uploadTask.on('state_changed', (snap) => {
            let progress = (snap.bytesTransferred / snap.totalBytes) * 100;
            setProgress(progress);
            console.log(progress);
        }, (err) => {
            setError(err);
        }, async () => {
            const url = await getDownloadURL(storageRef);
            const createdAt = timestamp;
            await addDoc(collectionRef, { url, createdAt });
            setUrl(url);
        })
    }, [file]);

    return { progress, url, error }
}

export default useStorage;