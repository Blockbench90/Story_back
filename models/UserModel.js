const { model, Schema } = require('mongoose')

const UserSchema = new Schema({
    email: {
        unique: true,
        required: true,
        type: String,
    },
    fullName: {
        required: true,
        type: String,
    },
    userName: {
        unique: true,
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    confirmHash: {
        required: true,
        type: String,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    location: String,
    about: String,
    website: String,
}, {
    timestamps: true
});

UserSchema.set('toJSON', {
    transform: function (_, obj) {
        delete obj.password;
        delete obj.confirmHash;
        return obj;
    },
});

export const UserModel = model('User', UserSchema);
