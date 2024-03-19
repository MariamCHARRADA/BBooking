const asyncHandler = require("express-async-handler");
const Reservation = require("../models/reservationModel");
const Salon = require("../models/SalonModel");

//@desc Get all reservations
//@route GET /api/reservations
//@access Private
const getReservations = asyncHandler(async (req, res) => {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
});

//@desc Get all reservations of a user
//@route GET /api/reservations/user/:userId
//@access Private
const getUserReservations = asyncHandler(async (req, res) => {
    try{
    const userId = req.params.id;
    console.log('UserID:', userId); 
    const userReservations = await Reservation.find({ User: userId })
    .populate('Service', 'Name') 
    .populate('Salon', 'Name'); 
    console.log('Reservations:', userReservations); 
    res.status(200).json(userReservations);
}
catch(e){
    console.log("error ",e)
}
});

//@desc Create a new reservation
//@route POST /api/reservations
//@access Private
const createReservation = asyncHandler(async (req, res) => {
    const { Date, Time, Service, Salon, User } = req.body;
    if (!Date || !Time || !Service || !Salon || !User) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const reservation = await Reservation.create({
        Date,
        Time,
        Service,
        Salon,
        User
    });
    res.status(201).json(reservation);
});


//@desc delete reservation
//@route DELETE /api/reservations/:id
//@access Private
const deleteReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
        res.status(404);
        throw new Error("reservation not found");
    }
    await reservation.deleteOne({
        _id: req.params.id
    });
    res.status(200).json({ message: "reservation removed" });
});


//@desc Get availability for a salon
//@route GET /api/reservations/availability/:salonId
//@access Private
const getAvailabilityForSalon = asyncHandler(async (req, res) => {
    const { salonId } = req.params;
    const { date } = req.query;
    
    const salon = await Salon.findById(salonId);
    if (!salon) {
        return res.status(404).json({ message: "Salon not found" });
    }

    const openHour = salon.Open.getHours();
    const closeHour = salon.Close.getHours() === 0 ? 24 : salon.Close.getHours();

    let selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    let nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const reservations = await Reservation.find({
        Salon: salonId,
        Date: { $gte: selectedDate, $lt: nextDay }
    });

    let slots = [];
    for (let hour = openHour; hour < closeHour; hour++) {
        let timeSlot = `${hour < 10 ? '0' + hour : hour}:00`;
        let isAvailable = !reservations.some(reservation => 
            reservation.Time === timeSlot
        ); 
        slots.push({ time: timeSlot, isAvailable });
    }

    res.json({ slots });
});



module.exports = { getReservations, createReservation, deleteReservation,getAvailabilityForSalon,getUserReservations };