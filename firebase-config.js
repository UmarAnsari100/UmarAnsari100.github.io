
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDYmut5YSMsPFJGFkpvKmXbm4NjgWHKZ4E",
  authDomain: "portfolio-8b693.firebaseapp.com",
  projectId: "portfolio-8b693",
  storageBucket: "portfolio-8b693.firebasestorage.app",
  messagingSenderId: "794058394677",
  appId: "1:794058394677:web:8dcba38d43ec2ffcffb57c",
  measurementId: "G-PR1G9TVHEQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

// Enable persistence (optional)
db.enablePersistence()
  .catch((err) => {
    console.log("Firestore persistence error:", err);
  });