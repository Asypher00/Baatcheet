const express = require("express") ; 
const contactsRoutes = express.Router(); 
const { verifyToken } = require("../middlewares/AuthMiddleware") ; 
const { searchContacts } = require("../controllers/ContactsController") ; 

contactsRoutes.post("/search", verifyToken, searchContacts) ; 
module.exports = contactsRoutes


