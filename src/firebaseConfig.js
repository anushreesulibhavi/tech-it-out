// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD98xV7NlyYF9ApnNC5bhSBRfM9XM0KomA",
    authDomain: "module10-a4aa9.firebaseapp.com",
    projectId: "module10-a4aa9",
    storageBucket: "module10-a4aa9.appspot.com",
    messagingSenderId: "564621044983",
    appId: "1:564621044983:web:d4dab97e3d6a39bd7af7f2",
    measurementId: "G-RDH0ENDLYV"
  };
  

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, app as default };


