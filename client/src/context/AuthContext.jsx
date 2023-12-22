import { createContext,useState } from "react";
import {useEffect, useCallback } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext  = createContext();

export const AuthContextProvider = ({children})=>{
    const [user,setUser] = useState(null);
    const [registerError,setRegisterError] = useState(null);
    const [isRegisterLoading,setisRegisterLoading] = useState(false);
    
    const [registerInfo,setRegisterInfo] = useState({
        name:"",
        email:"",
        password:"",
    });
    
    const [loginError,setLoginError] = useState(null);
    const [isLoginLoading,setisLoginLoading] = useState(false);

    const [loginInfo,setLoginInfo] = useState({
        
        email:"",
        password:"",
    });
        
        
        useEffect (()=>{
            const user = localStorage.getItem("User");
            setUser(JSON.parse(user));
        },[]);
    
    const updateRegisterInfo = useCallback((info)=>{
        setRegisterInfo(info);
    },[]);
    
    const registerUser = useCallback(async (e)=>{
      e.preventDefault();
        setisRegisterLoading(true);
      setRegisterError(null);

        const response =  await postRequest(`${baseUrl}/users/register`,JSON.stringify(registerInfo));

        setisRegisterLoading(false)
        if(response.error){
            return setRegisterError(response);
        }
        try{

            localStorage.setItem("User",JSON.stringify(response));
        }
        catch(error){
            alert(error);
        }
        setUser(response);
    },[registerInfo]);
    
    const logoutUser = useCallback(()=>{
        localStorage.removeItem("User");
        setUser(null);
    },[]);
    

    const loginUser  =useCallback(async(e)=>{
        e.preventDefault();
        setisLoginLoading(true);
        setLoginError(null);
            const response=  await postRequest(`${baseUrl}/users/login`,JSON.stringify(loginInfo));
        
        setisLoginLoading(false);
        if(response.error){
            return setLoginError(response)
        }
        localStorage.setItem("User",JSON.stringify(response))
        setUser(response);
    },[loginInfo]);
    const updateLoginInfo = useCallback((info)=>{
        setLoginInfo(info);
    },[]);


    return( 
    <AuthContext.Provider value = {{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading

    }}>{children}   
    </AuthContext.Provider>
    );
}