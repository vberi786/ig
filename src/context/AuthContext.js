import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { createContext,useState,useEffect } from "react";

export const AuthContext=createContext();

export const AuthContextProvider=({children})=>{
    const [currentUser,setCurrentUser]=useState({})

    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,(user)=>{
            setCurrentUser(user);
        })
        return ()=>{
            unsubscribe();
        }
    })

    function uid() {
        return (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,"");
    };

    return(
        <AuthContext.Provider value={{currentUser,uid}}>
            {children}
        </AuthContext.Provider>
    )
}

