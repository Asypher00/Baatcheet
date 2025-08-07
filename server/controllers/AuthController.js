const {
    renameSync,
    unlinkSync
} = require("fs");
const User = require("../models/UserModel");

const maxAge = 3 * 24 * 60 * 60 * 1000;

const signup = async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    const userExists = await User.findOne({
        email
    });
    if (userExists) {
        return res.status(400).json({
            success: false,
            message: "User already Exists",
        });
    }
    try {
        const user = await User.create({
            ...req.body,
        });
        const token = user.createJWT();
        res.cookie("jwt", token, {
            withCredentials: true,
            httpOnly: false,
            maxAge,
            sameSite: "None",
            secure: true,
        })
        return res.status(201).json({
            success: true,
            data: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                profileSetup: user.profileSetup,
                color: user.color,
            },
        });
    } catch (error) {
        console.log({
            error
        });
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }


}
const login = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;
        if (email && password) {
            const user = await User.findOne({
                email
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Credentials",
                });
            }
            const token = user.createJWT();
            res.cookie("jwt", token, {
                maxAge,
                secure: true,
                sameSite: "None",
            });
            return res.status(200).json({
                success: true,
                data: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    image: user.image,
                    profileSetup: user.profileSetup,
                    color: user.color,
                },
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Email and Password Required",
            });
        }
    } catch (error) {
        console.log({
            error
        });
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
};

const getUserInfo = async (req, res, next) => {
    try {
        if (req.user.id) {
            const user = await User.findById(req.user.id);
            if (user) {
                return res.status(200).json({
                    success: true,
                    data: {
                        id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        image: user.image,
                        profileSetup: user.profileSetup,
                        color: user.color,
                    }
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
        } else {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
    } catch (error) {
        console.log({
            error
        });
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            color
        } = req.body;

        if (!req.user.id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required."
            });
        }

        if (!firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: "Firstname and Last name is required."
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id, {
                firstName,
                lastName,
                color,
                profileSetup: true,
            }, {
                new: true,
                runValidators: true,
            }
        );
        return res.status(200).json({
            success: true,
            data: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                profileSetup: user.profileSetup,
                color: user.color,
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const addProfileImage = async (req, res, next) => {
    try {
        if (req.file) {
            const date = Date.now();
            let fileName = "uploads/profiles/" + date + req.file.originalname;
            renameSync(req.file.path, fileName);
            const updatedUser = await User.findByIdAndUpdate(
                req.user.id, {
                    image: fileName,
                }, {
                    new: true,
                    runValidators: true,
                }
            );
            return res.status(200).json({
                success: true,
                data: {
                    image: updatedUser.image
                }
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "File is required."
            });
        }
    } catch (error) {
        console.log({
            error
        });
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
};

const removeProfileImage = async (req, res, next) => {
    try {
        if (!req.user.id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required."
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        if (user.image) {
            unlinkSync(user.image);
        }

        user.image = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile image removed successfully."
        });
    } catch (error) {
        console.log({
            error
        });
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const logout = async (req, res, next) => {
    try {
       res.cookie("jwt", "", {
        maxAge: 1,
        secure: true,
        sameSite: "None",
       })
       res.status(200).json({
        success: true,
        message: "Logged out successfully",
       }); 
    } catch (error) {
        console.log({
            error
        });
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    signup,
    login,
    getUserInfo,
    updateProfile,
    addProfileImage,
    removeProfileImage,
    logout
};