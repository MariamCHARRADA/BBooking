const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register a user
//@route POST /api/users/register
//@access public
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  //create new user

  //hash password:
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  //create user:
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role,
  });

  console.log(`User created ${user}`);
  if (user) {
    res.status(201).json({ user: user });
  } else {
    res.status(400);
    throw new Error("User data not valid");
  }
  res.json({ message: "register user" });
});

//@desc login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken, user });
  } else {
    res.status(401);
    throw new Error("password not valid");
  }
  res.json({ message: "login user" });
});

//@desc delete a user
//@route DELETE /api/users/deleteUser/:id
//@access private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User Not Found");
  }
  await User.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "User removed" });
});

//@desc Update a user
//@route PUT /api/users/updateUser/:id
//@access private
const updateUser = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
      res.status(404);
      throw new Error("User not found");
  }

  // Check if the email already exists in the database (except for the current user)
  if (email && await User.findOne({ email: email, _id: { $ne: req.params.id } })) {
      res.status(400);
      throw new Error("Email already in use");
  }

  // Update user with new values, excluding password and role
  const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
          username: username || user.username,
          email: email || user.email,
      },
      { new: true } // Return the updated document
  );

  if (updatedUser) {
      res.status(200).json(updatedUser);
  } else {
      res.status(400);
      throw new Error("Unable to update user");
  }
});


module.exports = {
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
  updateUser
};
