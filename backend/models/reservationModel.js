const mongoose = require('mongoose');


const ReservationSchema = mongoose.Schema({
  Service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Services',
    required: [true, 'Please add a service'],
  },
  Salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: [true, 'Please add a salon']
  },
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  Date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  Time: {
    type: String,
    required: [true, 'Please add a time'],
    unique: [true, 'You already have a reservation at this time']
  }
});

// Creates a compound index on Service and Time fields to ensure that 
// there can be no duplicate reservations for the same service at the same time
ReservationSchema.index({ Service: 1, Time: 1 }, { unique: true });

module.exports = mongoose.model('Reservation', ReservationSchema);