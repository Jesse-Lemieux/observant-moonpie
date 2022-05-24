const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat')

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
        },
        thoughts: [],
        friends: []
    },
    {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
}
);

UserSchema.virtual('friendCount').get(function(){
    return this.friends.length + 1
})