const express = require("express");
const authRoutes = express.Router();
const {
    signup,
    login,
    getUserInfo,
    updateProfile,
    addProfileImage,
    removeProfileImage
} = require("../controllers/AuthController");
const {
    verifyToken
} = require("../middlewares/AuthMiddleware");
const multer = require("multer") ; 
const upload = multer({dest: "uploads/profiles/"}) ; 
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/userInfo", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile)
authRoutes.post("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImage);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage) ; 
module.exports = authRoutes;