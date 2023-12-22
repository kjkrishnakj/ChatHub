import { Container, Stack } from "react-bootstrap";
import { ChatContext } from "../context/chatContext";
import { useContext } from "react";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";
const chat = () => {
    const { user } = useContext(AuthContext)
    const { userChats, isuserChatsLoading, updateCurrentChat } =
     useContext(ChatContext)
    
    //  console.log("UserChats", userChats);
    
    return (<Container>
        <PotentialChats/>


        {userChats?.length < 1 ? null : (
        <Stack direction="horizontal" gap = {4} 
            className ="align-item-start" >
            <Stack className="messages-box flex-grow-0 pe-3 " gap = {3}>
            {isuserChatsLoading && <p>Loading chats...</p>}
            {userChats?.map((chat,index)=>{
            return(
                <div key ={index} onClick={()=>{
                    updateCurrentChat(chat)
                }}>
                    <UserChat chat = {chat} user = {user}/>
                </div> 
            );
            }) }

            </Stack>
            <ChatBox/>
        </Stack>
        )}


    </Container>
    );
};

export default chat;