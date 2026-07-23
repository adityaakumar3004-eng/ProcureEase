const AuthService = require("../services/AuthService");

// Register Controller
const register = async (req, res,next) => {
  try {
    const { fullName, email, password, role } = req.body;

    const result = await AuthService.registerUser(
      fullName,
      email,
      password,
      role
    );

    res.status(201).json(result);
  } catch (error) {
        next(error);
    }
};

// Login Controller
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.loginUser(email, password);

    res.status(200).json(result);
  }  catch (error) {
        next(error);
    }
};

module.exports = {
  register,
  login,
};