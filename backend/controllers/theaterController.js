const Theater = require("../models/Theater");
const Screen = require('../models/Screen');
const createTheater = async (req, res, next) => {
    try {
        const { name, location, type } = req.body;
        if (!name || !location) {
            return res.status(400).json({
                success: false,
                message: "Fill Form Properly"
            })
        }

        const existingTheatre = await Theater.findOne({
            name: { $regex: `^${name}$`, $options: 'i' },
            location: location
        });

        if (existingTheatre) {
            return res.status(403).json({
                success: false,
                message: "Theatre already exist"
            })
        }

        const theater = await Theater.create({
            name,
            location,
            type,
            avilableScreens: [] //Default Array
        })

        res.status(201).json({
            success: true,
            message: "Theatre Created",
            theater
        })
    } catch (error) {
        next(error);
    }
}

const getTheatres = async (req, res, next) => {
    try {

        const { location, name, type } = req.query;
        const query = {};
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        if (type) {
            query.type = { $regex: type, $options: 'i' };
        }

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        const theatres = await Theater.find(query).populate('avilableScreens', 'name type seats').sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            count: theatres.length,
            theatres
        })
    } catch (error) {
        next(error);
    }
}

const updateTheatre = async (req, res, next) => {
    try {
        const theater = await Theater.findById(req.params.id);
        console
        if (!theater) {
            return res.status(400).json({
                success: false,
                message: "Theater Not Found"
            })
        }

        const { name, location, type } = req.body;

        // if (name || location) {
        // }
        const newName = name ? name.trim() : theater.name;
        const newLocation = location ? location.trim() : theater.location;
        const duplicate = await Theater.findOne({
            _id: { $ne: theater._id },
            name: { $regex: `^${newName}$`, $options: 'i' },
            location: { $regex: `^${newLocation}$`, $options: 'i' },
        })

        if (duplicate) {
            return res.status(400).json({
                success: false,
                message: "Duplicate Theatre"
            })
        }

        if (name) theater.name = name.trim();
        if (location) theater.location = location.trim();
        if (type) theater.type = type.trim();

        await theater.save();

        res.status(200).json({
            success: true,
            message: "Theater Updated"
        })
    } catch (error) {
        next(error);
    }
}

const deleteTheatre = async (req, res, next) => {
    try {
        const theater = await Theater.findById(req.params.id);
        if (!theater) {
            return res.status(400).json({
                success: false,
                message: "Theater Not Found"
            })
        }

        if (theater.avilableScreens.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Theatre has screen attached try deleting them"
            })
        }

        await theater.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Theatre Deleted"
        })
    } catch (error) {
        next(error);
    }
}

module.exports = { createTheater, getTheatres, updateTheatre, deleteTheatre };