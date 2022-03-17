import React, { useState } from 'react';
import { db } from '../firebase/config';
import useFirestore from '../hooks/useFirestore';
import { collection, doc, updateDoc } from "firebase/firestore";


const ImageCaption = ({url, caption, setCaption}) => {
    const { docs } = useFirestore('images');
   
    const collectionRef = collection(db, 'images')
    let imageRef;
    let text;
    let date;
    
    docs.map(img => {
        if(img.url === url) {
            imageRef = doc(db, 'images', img.id);
            console.log(imageRef);
        }
    })
    
    const clickHandler = (e) => {
        e.preventDefault();
        setCaption(true);
        console.log(caption);
        updateDoc(imageRef, {
            caption: text,
            dateOfImg: date
        });
    }

    return (
        <div className='desc-form'>
            <input value={text} onChange={(e) => {text = e.target.value}}></input>
            <span>Year Photo Was Taken</span>
            <input type="date" value={date} onChange={(e) => {date = e.target.value }}></input>
            <button onClick={clickHandler}>Submit</button>
        </div>
    )
}

export default ImageCaption;