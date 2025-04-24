
const{Schema} = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true // optional but helpful
  },
  email: {
    type: String,
    required: true,
    unique: true // optional but good for auth
  }
});


userSchema.plugin(passportLocalMongoose);

module.exports = {userSchema};
