import mongoose, { Schema } from "mongoose";

class Class extends mongoose.Schema({
    name: {
        type: Schema.Types.String, 
        required: [true, "Name is required"]
    }, 
    
})

