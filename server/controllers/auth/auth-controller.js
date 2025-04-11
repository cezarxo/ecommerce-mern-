const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message:
          "User already exists with the same email, please try with another email",
      });
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registeration Success",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some Error occured",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({ success: false, message: "User doesn't exists" });
    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({ success: false, message: "Incorrect Password" });
    const token = jwt.sign(
      {
        email: checkUser.email,
        id: checkUser._id,
        role: checkUser.role,
        userName: checkUser.userName,
      },
      "CLIENT SECRET_KEY",
      { expiresIn: "1h" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
      })
      .json({
        success: true,
        message: "Login Success",
        user: {
          id: checkUser._id,
          email: checkUser.email,
          role: checkUser.role,
          userName: checkUser.userName,
        },
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some Error occured",
    });
  }
};

//logout
const logoutUser = async (req, res) => {
  res.clearCookie("token").json({ success: true, message: "Logout Success" });
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ success: false, message: "Unauthorized" });
  try {
    const decodeToken = jwt.verify(token, "CLIENT SECRET_KEY");
    req.user = decodeToken;
    next();
  } catch (e) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
};
