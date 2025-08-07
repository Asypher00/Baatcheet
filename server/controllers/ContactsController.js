const User  = require("../models/UserModel") ;

const searchContacts = async (req, res, next) => {
    try {
        const {
            searchTerm
        } = req.body;
        if (searchTerm === undefined || searchTerm === null) {
            return res.status(400).json({
                success: false,
                message: "Search Term is required",
            });

            const sanitizedSearchTerm = searchTerm.replace(
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
            }) ;
        }
    } catch (error) {
        console.log({ error }) ; 
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        }) ; 
    }
}

module.exports = {
    searchContacts
} ;