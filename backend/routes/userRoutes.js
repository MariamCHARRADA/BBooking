const express = require("express");
const {
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
  updateUser
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/userList", getUsers);

router.delete("/deleteUser/:id", deleteUser);

router.put("/updateUser/:id", updateUser);

module.exports = router;
