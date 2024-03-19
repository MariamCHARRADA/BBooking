const express = require("express");
const { getReservations, createReservation, deleteReservation ,getAvailabilityForSalon,getUserReservations} = require("../controllers/reservationController");

const router = express.Router();

router.get("/getReservations", getReservations);
router.get("/getUserReservation/user/:id", getUserReservations);

router.post("/createReservation", createReservation);
router.delete("/deleteReservation/:id", deleteReservation);
router.get('/:salonId/availability', getAvailabilityForSalon);

module.exports = router;