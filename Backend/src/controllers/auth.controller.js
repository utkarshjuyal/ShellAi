import jwt from "jsonwebtoken";

// Models
import collectionSavesModel from "../models/collectionSaves.model.js";
import highlightSaveModel from "../models/highlightSave.model.js";
import collectionModel from "../models/collections.model.js";
import highlightModel from "../models/highlight.model.js";
import saveModel from "../models/saves.model.js";
import userModel from "../models/user.model.js";

// Utils
import { cookieOptions } from "../utils/constants.js";

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    // Create user directly as verified.
    // No email verification is required.
    const user = await userModel.create({
      username,
      email,
      password,
      verified: true,
      verificationExpiresAt: null,
    });

    // Automatically log the user in after registration.
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
}


export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error.message,
    });
  }
}


export async function logout(req, res) {
  res.clearCookie("token", cookieOptions);

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
}


export async function deleteUser(req, res) {
  try {
    const userId = req.user.id;

    await highlightSaveModel.deleteMany({ userId });
    await highlightModel.deleteMany({ userId });
    await collectionSavesModel.deleteMany({ userId });
    await collectionModel.deleteMany({ userId });
    await saveModel.deleteMany({ userId });

    await userModel.findByIdAndDelete(userId);

    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user account",
    });
  }
}


export async function getMe(req, res) {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get user",
    });
  }
}