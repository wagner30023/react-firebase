import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDhLrEzx_jQELgQEnrvBpcmY7CYzoJCYmE",
    authDomain: "curso-b8923.firebaseapp.com",
    projectId: "curso-b8923",
    storageBucket: "curso-b8923.appspot.com",
    messagingSenderId: "411466295010",
    appId: "1:411466295010:web:b45c92e9902fca8422a0bb",
    measurementId: "G-N6LE7C3G1K"
};


const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
export { db, auth };
