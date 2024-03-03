import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../db/user.js";
import HttpError from "../helpers/HttpError.js";

export const registerUser = async (email, password) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw HttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    return { email, subscription: user.subscription };
  } catch (error) {
    throw HttpError(500, error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(user._id, { token });

    return {
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    };
  } catch (error) {
    throw HttpError(500, error.message);
  }
};

export const logoutUser = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, { token: null });
  } catch (error) {
    throw HttpError(500, error.message);
  }
};

export const getCurrentUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw HttpError(401, "Not authorized");
    }
    return {
      email: user.email,
      subscription: user.subscription,
    };
  } catch (error) {
    throw HttpError(500, error.message);
  }
};

export const updateSubscription = async (userId, subscription) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { subscription },
      { new: true }
    );
    if (!user) {
      throw HttpError(404, "User not found");
    }
    return {
      email: user.email,
      subscription: user.subscription,
    };
  } catch (error) {
    throw HttpError(500, error.message);
  }
};
