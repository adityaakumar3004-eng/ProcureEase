const AuthService = require("../services/AuthService");

// Register Controller
const register = async (req, res) => {
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
    res.status(400).json({
      message: error.message,
    });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.loginUser(email, password);

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};