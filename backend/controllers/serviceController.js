const asyncHandler = require("express-async-handler");
const Service = require("../models/ServicesModel");


//@desc Get all contacts
//@route Get /api/contacts
//@access private
const getServices = asyncHandler(async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

//@desc create new service
//@route POST /api/services
//@access private
const createService = asyncHandler(async (req, res) => {
    try {
        const { Name } = req.body;
        let imageUrl = null;

        if (!Name) {
            res.status(400);
            throw new Error("Service name is required");
        }

        if (req.file) {
            imageUrl = req.file.path;
        }

        const service = await Service.create({
            Name,
            Photo: imageUrl,
        });

        // Send the created service as a response
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const updateService = asyncHandler(async (req, res) => {
    console.log('Request Params:', req.params);
    console.log('Request Body:', req.body);
    console.log('File:', req.file);

    const service = await Service.findById(req.params.id);
    if (!service) {
        res.status(404);
        throw new Error("Service not found");
    }

    const { Name } = req.body;
    let imageUrl = service.Photo;  // Default to existing image

    if (req.file) {
        imageUrl = req.file.path;  // Update with new image if provided
    }

    const updatedService = await Service.findByIdAndUpdate(req.params.id, {
        Name: Name || service.Name,
        Photo: imageUrl
    }, { new: true });

    res.status(200).json(updatedService);
});



//@desc delete service
//@route DELETE /api/services/:id
//@access private
const deleteService = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
        res.status(404);
        throw new Error("Service Not Found");
    }
    await Service.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "service removed" });
});

module.exports = { getServices, createService, updateService, deleteService };