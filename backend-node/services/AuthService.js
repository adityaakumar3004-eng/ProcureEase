const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const AppError = require("../utils/AppError");

// Register Service
const registerUser = async (fullName, email, password, role = "manager") => {

  // Check if email already exists
  const existingUser = await User.findUserByEmail(email);

  if (existingUser) {
    throw new AppError(
    "Email already registered",
    400
       ); 
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user
  await User.createUser(fullName, email, hashedPassword, role);

  return {
    message: "User Registered Successfully",
  };
};

// Login Service
const loginUser = async (email, password) => {

  const user = await User.findUserByEmail(email);

  if (!user) {
    throw new AppError(
    "Invalid Email or Password",
    401
     );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError(
    "Invalid Email or Password",
    401
      );
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    message: "Login Successful",
    token,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};