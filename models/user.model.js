const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    firstName: {
      type: String,
      required: [true, "First Name Required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name Required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email alredy exists"],
      validate: {
        validator: (v) => {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid Email Id`,
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
  });
  
  const User = mongoose.model("User", UserSchema);

  module.exports={User}