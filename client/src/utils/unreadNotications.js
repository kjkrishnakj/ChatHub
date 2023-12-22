export const unreadNotificationFunc =(notifications)=>{
    return notifications.filter((n)=>n.isRead ==false);
}