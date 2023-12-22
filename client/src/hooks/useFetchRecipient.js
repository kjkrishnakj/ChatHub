import { useEffect,useState } from "react";
import { baseUrl ,getRequest} from "../utils/services";
// console.log("hello1");
export const  useFetchRecipientUser = (chat,user)=>{
    
    const [recipientUser,setRecipientUser]=useState(null);
    
    const[error,setError]  =  useState(null);
    const recipientId = chat?.members?.find((id) => id !==user?._id);
    // console.log("chat");
    useEffect(()=>{
        const getUser =  async()=>{        
            if(!recipientId) return null;
            const response  =await getRequest(`${baseUrl}/users/find/${recipientId}`);
            // if(response.error){
                //     return setError(response);
                
                // }
                // console.log(responsename);
                setRecipientUser(response);
                // console.log("res" ,recipientUser );
 
    };

    getUser();

},[recipientId]);
 return {recipientUser};
};