import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import './App.css';
import AppRouter from './router';
// import store from './store';
import store from "./dev-store"
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import ExampleTable from './react-components/Table/example';
import { Box, TextField } from '@mui/material';
import FileUploadField from './FileUpload';

function App() {

  // useEffect(()=>{
  //   return onAuthStateChanged(getAuth(), user => {
  //     if(user) seedAndTest()
  //   })
  // },[])

  useEffect(()=>{
    signInWithEmailAndPassword(getAuth(), "testemail@email.com", "password1234")
  },[])

  return (
    <Provider store={store}>
      {/* <ExampleTable/> */}
      {/* <AppRouter/> */}
      <FileUploadField/>
    </Provider>
  );
}

export default App;
