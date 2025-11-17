
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Import the functions you need from the SDKs you need


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD20XglMZtT90ApAOHCJoCemScMkkr2njY",
  authDomain: "device-reg-e9957.firebaseapp.com",
  databaseURL: "https://device-reg-e9957.firebaseio.com",
  projectId: "device-reg-e9957",
  storageBucket: "device-reg-e9957.firebasestorage.app",
  messagingSenderId: "451083753459",
  appId: "1:451083753459:web:4e136408d3886f1ae2a486",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)  