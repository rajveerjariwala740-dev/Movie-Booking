const mongoose = require('mongoose')

const screenSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
    },
    seats:{
        type:Number,
        required:true,
    },
    type:{
        type:String,
        enum: ['3D', 'IMAX', 'Dolby Cinema'],
        required:true,
    },
    theater:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Theater',
    },
},{timestamps:true});


screenSchema.index({theater : 1, name : 1}, {unique : true})
const Screen = mongoose.model('Screen', screenSchema);
module.exports = Screen;