const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require('dotenv').config();
const upload = require('./middleware/imageUploadHandler');
const path = require('path'); // Import path module


connectDb();
const app = express();


const port = process.env.PORT || 5000;

app.use(express.json()); //middleware to parse data stream + MUST be 1st
app.use("/api/contacts", require("./routes/contactRoutes")); //must be after
app.use("/api/users", require("./routes/userRoutes")); //must be after
app.use("/api/salons", require("./routes/SalonRoutes")); //must be after
app.use("/api/services", require("./routes/ServiceRoutes")); //must be after
app.use("/api/cities", require("./routes/CityRoutes")); 
app.use("/api/reservations", require("./routes/ReservationRoutes"));

app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

app.use(errorHandler);


app.listen(port, () => {
    console.log(`server running on port ${port}`);
});