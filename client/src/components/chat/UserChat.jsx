import { Stack } from "react-bootstrap";
import moment from "moment";
import avartar from "../../assets/avartar.svg"
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { useContext } from "react";
import { ChatContext } from "../../context/chatContext";
import { unreadNotificationFunc } from "../../utils/unreadNotications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
const UserChat = ({chat,user}) => {
    const {recipientUser} = useFetchRecipientUser( chat,user)
    const {onlineUsers,notifications,markthisUserNoticatonAsread}  = useContext(ChatContext);
    const truncateText = (text)=>{
        let shortText= text.substring(0,20);
        if(text.length>20 ){
            shortText =shortText+"..."
        }
        return shortText;
    }
    const unreadNotications = unreadNotificationFunc(notifications);
    const thisUserNotification  = unreadNotications?.filter(
        n=> n.senderId === recipientUser?._id)
        const {latestMessage} = useFetchLatestMessage(chat);
        const isOnline = onlineUsers?.some ((user)=> user?.userId ===recipientUser?._id)
        // console.log(recipientUser)/;
    
    return  (<Stack
     direction = "horizontal" gap = {3} 
    className = "user-card align-item-center p-2 justify-content-between " role = "button"
    onClick={()=>{
        if(thisUserNotification?.length !== 0){
            markthisUserNoticatonAsread(
                thisUserNotification,
                notifications
            )
        }
    }}>
        <div className ="d-flex"> 
        <div className="me-2"> <img src={avartar} alt="" height = "35px" />
        </div>
        <div className="text-contnt">
            <div className="name">{recipientUser?.name}</div>
            <div className="text">{
                latestMessage?.text && (
                    <span>{truncateText(latestMessage?.text)}</span>
                )
            }</div>
        </div>
        </div>
        <div className="d-flex flex-column align-items-end">
            <div className="date">{moment(latestMessage?.createdAt).calendar()}12/12/2022
            <div className={thisUserNotification?.length > 0 ?"this-user-notifications":""}>{thisUserNotification?.length? thisUserNotification.length:" "} </div>
            <span className={isOnline ? "user-online":""}></span>
                </div>
        </div> 

   </Stack> );
}
 
export default UserChat;