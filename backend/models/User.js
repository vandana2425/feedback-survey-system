const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, match: /.+@.+\..+/ },
  password: { type: String, required: true },
}, { timestamps: true, versionKey: false });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(); // Asynchronous salt generation
  this.password = await bcrypt.hash(this.password, salt); // Asynchronous hashing
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
