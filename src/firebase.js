import secret  from "./secret";
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

// secret is firebaseConfig
const firebaseApp = initializeApp(secret);

const auth=getAuth(firebaseApp); 
const storage=getStorage(firebaseApp);//storage
const db=getFirestore(firebaseApp);//firestore

export {auth,db,storage}; 