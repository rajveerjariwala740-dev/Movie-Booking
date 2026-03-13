const Screen = require("../models/Screen");
const Theater = require("../models/Theater");

const addScreen = async (req, res, next) => {
    try {
        const { name, seats, type, theaterId } = req.body;

        //Required Field
        if (!name || !seats || !type || !theaterId) {
            return res.status(400).json({
                success: false,
                message: 'Fields must be filled'
            })
        }

        const theater = await Theater.findById(theaterId);
        if (!theater) {
            return res.status(404).json({
                success: false,
                message: "Theater does not exist"
            })
        }

        const existingScreen = await Screen.findOne({
            theater: theaterId,
            name: { $regex: `^${name}$`, $options: "i" }
        })

        if (existingScreen) {
            return res.status(400).json({
                success: false,
                message: "Screen Already Exist"
            })
        }

        const screen = await Screen.create({
            name: name.trim(),
            seats: Number(seats),
            type,
            theater: theaterId
        })

        theater.avilableScreens.push(screen._id);
        await theater.save();

        //Populate
        await screen.populate('theater');

        res.status(201).json({
            success: true,
            message: "Screen Added",
            screen
        })
    } catch (error) {
        next(error);
    }
}


const getScreens = async (req, res, next) => {
    const { theaterId } = req.query;
    const query = theaterId ? { theater: theaterId } : {};

    const screens = await Screen.find(query)
        .populate('theater', 'name location')
        .sort({ name: 1 })

    res.status(200).json({
        success: true,
        count: screens.length,
        screens
    })

}

const getScreenById = async (req, res, next) => {
    try {
        const screen = await Screen.findById(req.params.id).populate('theater');

        if (!screen) {
            return res.status(400).json({
                success: false,
                message: "Screen Not Found"
            })
        }
        res.status(200).json({
            success: true,
            screen,
        })
    } catch (error) {
        next(error);
    }
}

const updateScreen = async (req, res, next) => {
    try {
        const screen = await Screen.findById(req.params.id);
        if (!screen) {
            return res.status(400).json({
                success: false,
                message: "Screen Not Found"
            })
        }

        const { name, type, seats } = req.body;

        //Duplicate Name Handling
        if (name) {
            const newName = name.trim();
            const duplicate = await Screen.findOne({ _id: { $ne: screen._id }, theater: screen.theater, name: { $regex: `^${newName}`, $options: "i" } });

            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message: 'Duplicate Screen Found'
                })
            }
            screen.name = newName;
        }

        if (seats) screen.seats = Number(seats);
        if (type) screen.type = type;

        await screen.save();
        await screen.populate('theater');
        res.status(200).json({
            success: true,
            message: 'Screen Updated'
        })
    } catch (error) {
        next(error);
    }
}


const deleteScreen = async (req, res, next) => {
    try {
        const screen = await Screen.findById(req.params.id);
        if (!screen) {
            return res.status(400).json({
                success: false,
                message: "Screen Not Found"
            })
        }

        await Theater.updateOne(
            { _id: screen.theater },
            { $pull: { avilableScreens: screen._id } }
        );
        await screen.deleteOne();
        res.status(200).json({
            success : true,
            message : 'Screen Deleted'
        })
    } catch (error) {
        next(error);
    }
}



module.exports = { addScreen, getScreens, getScreenById, updateScreen, deleteScreen };