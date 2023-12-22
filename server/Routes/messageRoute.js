const express =require("express");
const {createMessage,getMessage} = require("../Controllers/messageControllers");
const router = express.Router();

router.post("/",createMessage);
router.get("/:chatId",getMessage);



module.exports  = router;