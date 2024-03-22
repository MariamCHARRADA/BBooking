const express = require("express");
const {
  getSalons,
  createSalon,
  getSalon,
  deleteSalon,
  updateSalon,
  getUserSalon,
} = require("../controllers/salonController");
const upload = require("../middleware/imageUploadHandler");

const router = express.Router();

router.get("/getSalons", getSalons);
router.get("/getSalon/:id", getSalon);
router.get("/getUserSalon/:id", getUserSalon);

router.delete("/deleteSalon/:id", deleteSalon);
router.put("/updateSalon/:id", updateSalon);
router.post("/createSalon", upload.single("image"), createSalon);

module.exports = router;
