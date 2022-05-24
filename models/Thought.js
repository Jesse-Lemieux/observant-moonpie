const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat')

const ThoughtSchema = new Schema(
    {
        thoughtText:{
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt:{
            type: Date,
            default: Date.now,
            get: createdAtValue => dateFormat(createdAtValue)
        },
        username:{
            type: String,
            required: true
        },
        reactions:[]
    },
    {
        toJSON:{
            virtuals: true,
            getters: true
        },
        id:false
    }
)
ThoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length + 1
})