import React, {useState} from 'react';
import { auth, db, projectStorage, timestamp } from '../firebase/config';
import useFirestore from '../hooks/useFirestore';
import { query, getDocs, collection, doc, setDoc, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';



const AddComment = ({selectedImg, addCaption, setAddCaption}) => {
    const { docs } = useFirestore('images');
    const [ comment, setComment ] = useState("")
    const [ error, setError ] = useState("");
   
    let imageRef;
    let text;
    let date;
    let currentUser = auth.currentUser.displayName;
    
    
    
    docs.map(img => {
        if(img.url === selectedImg) {
            imageRef = img.id;
        }
    });
    console.log(imageRef);
    
    
    const clickHandler = async () => {
       try { 
        setAddCaption(false);
        const collectionRef = collection(db, `images/${imageRef}/comments`);
        const createdAt = new Date().toDateString();
        const userComment = text;
        const user = currentUser;
        await addDoc(collectionRef, {createdAt, userComment, user})
       } catch (err) {
            setError(err);
            console.log(error)
       }
    }

    return (
        <div className='desc-form'>
            <textarea className='desc-input' value={text} placeholder="Add your thoughts, memories or whatever you would like." onChange={(e) => {text = e.target.value}}></textarea>
            <button className="button submit-caption-btn" onClick={clickHandler}>SUBMIT</button>
        </div>
    )
}

export default AddComment;