const {model, Schema, Document } = require('mongoose')


const StoryModal = new Schema({
    text: {
        required: true,
        type: String,
        maxLength: 1000
    },
    user: {
        required: true,
        ref: 'User',
        type: Schema.ObjectId
    }
},
    {
        timestamps: true
    })
export const StoryModel = model('Story', StoryModal)