const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title : {
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        default : 0
    },
    genre:{
        type:String,
        enum : ['Action', 'Comedy', 'Horror','Sci-fi'],
    },
    duration:{
        type:Number,
        required:true,
    },
    poster:{
        type:String,
        required:true,
    },
    language:{
        type:String,
        required:true,
    }
}, {timestamps : true})

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;