const asyncHandler = require("express-async-handler");
const Salon = require("../models/SalonModel");

const mongoose = require("mongoose");

//@desc Get all salons
//@route GET /api/salons
//@access Private
const getSalons = asyncHandler(async (req, res) => {
  try {
    const salons = await Salon.find().populate({
      path: "User",
      select: "email",
    }).populate({
      path: "Services",
      select: "Name",
    })
    .populate({
      path: "City",
      select: "Name",
    });
    res.status(200).json(salons);
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@desc Create a new salon
//@route POST /api/salons
//@access Private
const createSalon = asyncHandler(async (req, res) => {
  try {
    const { Name, Address, City, User, Open, Close } = req.body;
    let imageUrl = null;

    if (!Name || !Address || !City || !User || !Open || !Close) {
      res.status(400);
      throw new Error("All fields are mandatory");
    }

    const servicesIds = req.body.Services;

    // Check if servicesIds is an array
    if (!Array.isArray(servicesIds)) {
      res.status(400);
      throw new Error("Services must be provided as an array");
    }
    console.log(servicesIds);
    // Parse service IDs to ensure they are in the correct format
    servicesIds.forEach((serviceId) => {
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        res.status(400);
        throw new Error("Invalid service ID");
      }
    });

    if (req.file) {
      imageUrl = req.file.path;
    }

    // Convert Services array to array of ObjectIds

    const salon = await Salon.create({
      Name,
      Address,
      City,
      Open,
      Close,
      Services: servicesIds,
      User: User,
      Photo: imageUrl,
    });

    res.status(201).json(salon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@desc Get a single salon by ID
//@route GET /api/salons/:id
//@access Private
const getSalon = asyncHandler(async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id)
      .populate({
        path: "User",
        select: "username",
      })
      .populate({
        path: "Services",
        select: "Name",
      });
    if (!salon) {
      res.status(404);
      throw new Error("Salon not found");
    }
    res.status(200).json(salon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@desc Update a salon
//@route PUT /api/salons/:id
//@access Private
const updateSalon = asyncHandler(async (req, res) => {
  const { Name, City, Address, Services, User, Open, Close } = req.body;
  const salon = await Salon.findById(req.params.id);
  if (!salon) {
    res.status(404);
    throw new Error("Salon not found");
  }

  salon.Name = Name || salon.Name;
  salon.City = City || salon.City;
  salon.Address = Address || salon.Address;
  salon.Services = Services || salon.Services;
  salon.User = User || salon.User;
  salon.Open = Open || salon.Open;
  salon.Close = Close || salon.Close;

  const updatedSalon = await salon.save();
  res.status(200).json(updatedSalon);
});

//@desc Delete a salon
//@route DELETE /api/salons/:id
//@access Private
const deleteSalon = asyncHandler(async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) {
      res.status(404);
      throw new Error("Salon not found");
    }
    await salon.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Salon removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { getSalons, createSalon, getSalon, updateSalon, deleteSalon };
