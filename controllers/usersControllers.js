import * as usersService from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let user;
    if (email && password) {
      user = await usersService.registerUser(email, password);
    } else {
      throw new Error("Email and password are required");
    }
    res.status(201).json({ user });
  } catch (error) {
    next(HttpError(409, error.message));
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let result;
    if (email && password) {
      result = await usersService.loginUser(email, password);
    } else {
      throw new Error("Email and password are required");
    }
    res.status(200).json(result);
  } catch (error) {
    next(HttpError(401, error.message));
  }
};

export const logout = async (req, res, next) => {
  try {
    if (req.user && req.user._id) {
      await usersService.logoutUser(req.user._id);
      res.status(204).end();
    } else {
      throw new Error("User not authorized");
    }
  } catch (error) {
    next(HttpError(401, error.message));
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    if (req.user && req.user._id) {
      const user = await usersService.getCurrentUser(req.user._id);
      res.status(200).json(user);
    } else {
      throw new Error("User not authorized");
    }
  } catch (error) {
    next(HttpError(401, error.message));
  }
};

export const updateSubscription = async (req, res, next) => {
  const { subscription } = req.body;

  try {
    let user;
    if (req.user && req.user._id && subscription) {
      user = await usersService.updateSubscription(req.user._id, subscription);
    } else {
      throw new Error("User ID and subscription are required");
    }
    res.status(200).json(user);
  } catch (error) {
    next(HttpError(500, error.message));
  }
};
