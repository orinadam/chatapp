const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please enter a username"],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: [6, "Minimum password length is 6 characters"]
    }
});

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();

})

UserSchema.statics.login = async function (username, password) {
    const user = await this.findOne({ username });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect username')
}


module.exports = mongoose.model('User', UserSchema);