import { createContext,useState,useEffect, useCallback } from "react";
import {baseUrl,postRequest, getRequest } from "../utils/services";
import {io} from "socket.io-client";
export const ChatContext = createContext();
export const ChatContextProvider=({children,user})=>{
    
    const [userChats,setUserChats] = useState(null);
    const [isuserChatsLoading,setUserChatsLoading] = useState(false);
    const [userChatsError,setUserChatsError] = useState(null);

    const [potentialChats,setPotentialChats] =useState([]);
    const [currentChat,setCurrentChat] = useState(null);
    
    const [messages,setMessages] = useState([]);
    const [isMessagesLoading,setMessagesLoading] = useState(false);
    const [messagesError,setMessagesError] = useState(null);
    
    const [sendTextMessageError,setSendTextMessageError] = useState(null);
    const [newMessage,setNewMessage] = useState(null);

    const [socket,setSocket] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([]);
    const [notifications,setNotifications] =useState([]);

    const[allUsers,setAllUsers]= useState([]);

    // console.log("noti :  ",notifications);
    useEffect(()=>{
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);
        newSocket.on("connect", () => {
            console.log("WebSocket connected");
        });
        return ()=>{
        newSocket.disconnect();
    }
},[user]);
//add onlineuser
useEffect(()=>{
    if (socket ===null) return;
    socket.emit("addNewUser",user?._id)
    socket.on("getOnlineUsers",(res)=>{
        setOnlineUsers(res);
    });
    return()=>{
        socket.off("getOnlineUsers");
    }
},[socket]);


//sendmsg
useEffect(()=>{
    if (socket ===null) return;
    const recipientId = currentChat?.members?.find((id) => id !==user?._id);

    socket.emit("sendMessage",{...newMessage,recipientId})
},[newMessage]);


//recv message and notifi

useEffect(()=>{
    if (socket ===null) return;
    socket.on("getMessage",res=>{
        
        console.log("Received message:", res);
        if(currentChat?._id !== res.chatId) return;
        setMessages((prev)=>[...prev,res]);
         console.log("Updated messages:", messages);
    });

    socket.on("getNotification",(res)=>{
        const isChatOpen = currentChat?.members.some(id=> id===res.senderId)
        if(isChatOpen){
            setNotifications(prev=>[{...res,isRead:true},...prev])
        }
        else{
            setNotifications(prev=>[res,...prev])  

        }
    })



    return()=>{
        socket.off("getMessage");
        socket.off("getNotification");
    }
},[socket,currentChat]);


    useEffect(()=>{
        const getUsers  = async()=>{
            const response = await getRequest(`${baseUrl}/users`);
            if(response.error){
                return console.log("Error fetching users! ",response);
            }
          const  pChats  =  response.filter((u)=>{ 
            let isChatCreated = false;

            if(user?._id === u?._id) return false;
            if(userChats){
             isChatCreated = userChats?.some((chat)=>{
                    return chat.members[0]===u._id||chat.members[1]===u._id
                })
            }
            return !isChatCreated;

            });
            setPotentialChats(pChats);
            setAllUsers(response);
        };
        getUsers();
    },[userChats]); 

    useEffect(()=>{
        const getUserChats = async()=>{
            if(user?._id){
                setUserChatsLoading(true)
                setUserChatsError(null);
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`)
                setUserChatsLoading(false)
                if(response.error)
                {
                    return setUserChatsError(response);
                }
                setUserChats(response);
            }
        }
        getUserChats();
    },[user,notifications]);

    useEffect(()=>{
        const getMessages = async()=>{
          
                setMessagesLoading(true)
                setMessagesError(null);
                const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`)
                setMessagesLoading(false)
                // console.log("r",response);
                if(response.error)
                {
                    return setMessagesError(response);
                }
                setMessages(response);
                }
        getMessages();
    },[currentChat]);
    const sendTextMessage = useCallback(
        async(textMessage,sender,currentChatId,setTextMessage)=>{
        if(!textMessage) return console.log("You must type something!",textMessage);
        const response = await postRequest(`${baseUrl}/messages`,JSON.stringify({
            chatId : currentChatId,
            senderId: sender._id, 
            text : textMessage
        }))
        if(response.error){
            return setSendTextMessageError(response)
        }
        setNewMessage(response);
        setMessages((prev)=>[...prev,response]);
        
        setTextMessage("");
    },[])
    
    // console.log("si",senderId);

const updateCurrentChat= useCallback((chat)=>{
    setCurrentChat(chat)
},[])

    const createChat = useCallback(async (firstId,secondId)=>{
        const response = await postRequest(`${baseUrl}/chats`,JSON.stringify({
            firstId,
            secondId, 
        })
    )
        if(response.error) return console.log("Error creating chat !",response);
        setUserChats((prev)=>[...prev,response]);
    },[])
    

const markAllNotificationAsRead = useCallback((notifications)=>{
    const mNotifications =notifications.map(n=>{
        return{...n,isRead:true}});
        setNotifications(mNotifications);
},[])

const markNotificationAsRead = useCallback((n,userChats,user,notifications)=>{
    const desiredChat = userChats.find(chat=>{
        const chatMembers = [user._id,n.senderId]
        const isDesiredChat = chat?.members.every(member =>{
            return chatMembers.includes(member);

        });
        return isDesiredChat;
    });
    const mNotifications = notifications.map(el=>{
        if(n.senderId === el.senderId){
            return {...n,isRead:true}
        }else{
            return el;
        }
    })
    updateCurrentChat(desiredChat);
    setNotifications(mNotifications);

})

const markThisUserNoticatonAsread =useCallback((thisUserNotifications,notifications)=>{
    const mNotifications = notifications.map(el=>{
        let notification;
        thisUserNotifications.forEach(n=>{
            if(n.senderId === el.senderId){
                notification = {...n,isRead:true }
            }else{
                notification =el
            }
        })

        return notification
    })
    setNotifications(mNotifications);
},[])



return<ChatContext.Provider value ={{
        userChats,
        isuserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        currentChat,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationAsRead,
        markNotificationAsRead,
        markThisUserNoticatonAsread
    }}>
        {children}
    </ChatContext.Provider>


}