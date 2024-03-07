import * as usersService from "../services/usersServices.js";
import gravatar from "gravatar";
import jimp from "jimp";
import path from "path";
import fs from "fs/promises";

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const avatarURL = gravatar.url(
      email,
      { s: "250", r: "x", d: "retro" },
      true
    );
    const user = await usersService.registerUser(email, password, avatarURL);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await usersService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      throw new Error("User not authorized");
    }
    await usersService.logoutUser(req.user._id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      throw new Error("User not authorized");
    }
    const user = await usersService.getCurrentUser(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  const { subscription } = req.body;

  try {
    if (!req.user || !req.user._id || !subscription) {
      throw new Error("User ID and subscription are required");
    }
    const user = await usersService.updateSubscription(
      req.user._id,
      subscription
    );
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { file } = req;
    const { id } = req.user;

    const img = await jimp.read(file.path);
    await img.resize(250, 250).writeAsync(file.path);

    const fileName = Date.now() + path.extname(file.originalname);
    const newLocation = path.join("public", "avatars", fileName);
    await fs.rename(file.path, newLocation);

    const avatarURL = "/avatars/" + fileName;
    const user = await usersService.updateUser(id, { avatarURL });

    res.json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};
