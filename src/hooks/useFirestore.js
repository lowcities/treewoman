import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

const useFirestore  = (collect) => {
    const [docs, setDocs] = useState([]);
    

    useEffect(() => {
        const collectionRef = collection(db, collect);
        const q = query(collectionRef, orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snapshot) => {
            let documents = [];
                snapshot.forEach(doc => {
                    documents.push({...doc.data(), id: doc.id})
                });
                setDocs(documents);
        })
        return () => unsub();    
    }, [collect])

    return { docs };
};

export default useFirestore;