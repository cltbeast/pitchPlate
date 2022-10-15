// Import the functions you need from the SDKs you need

import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";


// import { getAnalytics } from "firebase/analytics";




// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyDCYC6dDYwFGVWwzvPIgW2TA0d2EJktPeQ",

  authDomain: "pplateexpo.firebaseapp.com",

  projectId: "pplateexpo",

  storageBucket: "pplateexpo.appspot.com",

  messagingSenderId: "1066731601654",

  appId: "1:1066731601654:web:54852e155c22c4622336d7",

  measurementId: "G-W9SWP4B7KF"

};


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);


export {app};


//export { auth };

//const analytics = getAnalytics(app);