import React,{createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

//context
const authcontext = createContext();

//provider
const Authprovider= ({children})=> {
    //global state
    const [state, setstate] = useState({
        user : null,
        token : ""
    });

    //initial local storage data
    useEffect(()=>{
        const loadlocalstoragedata = async() => {
            let data = await AsyncStorage.getItem('@auth');
            let logindata = JSON.parse(data);
            setstate({...state, user : logindata?.user, token : logindata?.token}); //? -> if data is present 
        };
        loadlocalstoragedata();
    }, []);

    return(
        <authcontext.Provider value={[state, setstate]}>
            {children}
        </authcontext.Provider>
    )
};

export {authcontext, Authprovider};