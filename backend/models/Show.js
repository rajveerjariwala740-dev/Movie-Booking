const mongoose = require('mongoose')
const showSchema = new mongoose.Schema({
    movie:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Movie',
    },
    theater:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Theater',
    },
    screen:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Screen',
    },
    showDate:{
        type:Date,
        required:true,
    },
    showTime:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    bookedSeats:{
        type : [Number],
        default : []
    }
},{timestamps:true});


showSchema.index({movie : 1, theater : 1, screen : 1,showDate: 1, showTime : 1}, {unique: true})

showSchema.pre('save', function(){
    if(this.showDate < new Date()){
        return 'Show must be in future'
    }
})
const Show = mongoose.model('Show', showSchema);
module.exports = Show;