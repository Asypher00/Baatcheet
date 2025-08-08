const User = require("../models/UserModel");

const searchContacts = async (req, res, next) => {
    try {
        const {
            contact
        } = req.body;
        if (contact === undefined || contact === null) {
            return res.status(400).json({
                success: false,
                message: "Contact is required",
            });
        }

        const sanitizedSearchTerm = contact.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );
        const regex = new RegExp(sanitizedSearchTerm, "i"); 
        const contacts = await User.find({
            $and: [{
                _id: {
                    $ne: req.id
                }
            }, {
                $or: [{
                    firstName: regex
                }, {
                    lastName: regex,
                }, {
                    email: regex,
                }],
            }],
        });
        return res.status(200).json({
            success: true,
            data: contacts,
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

module.exports = {
    searchContacts
};