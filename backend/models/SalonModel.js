const mongoose = require("mongoose");

const SalonSchema = mongoose.Schema({
    Name: {
        type: String,
        required: [true, "Please add user name"],
    },
    Address: {
        type: String,
        required: [true, "Please enter your salon Address"],
    },
    Services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Services',
            required: [true, "Please add services"]
        }
    ],
    User :{
     type:mongoose.Schema.Types.ObjectId,ref:"User" 

    },
    Address: {
        type: String,
        required: [true, "Please enter your salon Address"],
    },
    City: {
        type: String,
        required: [true, "Please enter your salon city"],
    },
    Open: {
        type: Date,
        required: [true, "Please enter your salon opening time"],
    },
    Close: {
        type: Date,
        required: [true, "Please enter your salon closing time"],
    },
    Photo: {
        type: String,
    },
});

module.exports = mongoose.model("Salon", SalonSchema);