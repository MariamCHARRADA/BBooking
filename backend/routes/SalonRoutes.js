const express = require("express");
const { getSalons, createSalon ,getSalon, deleteSalon} = require("../controllers/salonController");
const upload = require("../middleware/imageUploadHandler"); 

const router = express.Router();

router.get("/getSalons", getSalons);
router.get("/getSalon/:id", getSalon);
router.delete("/deleteSalon/:id", deleteSalon);
router.post("/createSalon",upload.single('image') ,createSalon);


module.exports = router;
