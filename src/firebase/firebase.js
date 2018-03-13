import * as firebase from 'firebase';

const prodConfig = {
  apiKey: "AIzaSyD6OatDxXh8yttiwLhsxD_KtOk3bwIvX6U",
  authDomain: "elop-party-dba28.firebaseapp.com",
  databaseURL: "https://elop-party-dba28.firebaseio.com",
  projectId: "elop-party-dba28",
  storageBucket:"elop-party-dba28.appspot.com",
  messagingSenderId: "430620128929",
};

const devConfig = {
  apiKey: "AIzaSyD6OatDxXh8yttiwLhsxD_KtOk3bwIvX6U",
  authDomain: "elop-party-dba28.firebaseapp.com",
  databaseURL: "https://elop-party-dba28.firebaseio.com",
  projectId: "elop-party-dba28",
  storageBucket:"elop-party-dba28.appspot.com",
  messagingSenderId: "430620128929",
};

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
};
