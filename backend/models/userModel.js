const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add user name"],
    },
    email: {
        type: String,
        required: [true, "Please enter email"],
        unique: [true, "Email already registered"],
    },
    password: {
        type: String,
        required: [true, "Please add password"],
    },
    role :{
        type: String,
        enum: ["client", "owner"],
        required: [true, "Please add role"],

    }
});

module.exports = mongoose.model("User", userSchema);