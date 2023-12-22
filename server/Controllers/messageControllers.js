const messageModel = require("../Models/messageModel")


const createMessage = async(req,res)=>{
    const {chatId,senderId,text} = req.body
    const message = new messageModel({
        chatId,senderId,text
    })

    try{
        const response = await message.save()
        res.status(200).json(response);
    }catch(e){
        console.log(e);
        res.status(500).json(e);
    }
}


const getMessage = async (req, res) => {
    const { chatId } = req.params;
    // console.log("Received chatId:", chatId);

    try {
        const messages = await messageModel.find({ chatId });
        // console.log("Retrieved messages:", messages);

        res.status(200).json(messages);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
};



module.exports ={createMessage,getMessage};