const mongoose = require('mongoose');


const todoSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'todo-user',
    },
    dateDue:{
        type:Date,
         required:true
    },
    createdAt:{
        type:Date,
        required: true,
        default:Date.now,
    },
    subject:{
        type:String, 
        required:true
    },
    objective:{
        type:String, 
        required:true
    }
});




module.exports= mongoose.model('todo', todoSchema);
