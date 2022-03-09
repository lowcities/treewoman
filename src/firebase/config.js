import { initializeApp } from 'firebase/app';
import  { getStorage } from 'firebase/storage';
import { getFirestore, serverTimestamp } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDMQdRcKfhx3FPU--xmhQ0hxBAiVQDfCPk",
    authDomain: "treewoman-photo.firebaseapp.com",
    projectId: "treewoman-photo",
    storageBucket: "treewoman-photo.appspot.com",
    messagingSenderId: "604294205709",
    appId: "1:604294205709:web:c6ed7036b430ef3c33e044"
  };

  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);

  const projectStorage = getStorage(firebaseApp);
  const projectFirestore = getFirestore();
  const timestamp = serverTimestamp();

  export { projectStorage, projectFirestore, timestamp };