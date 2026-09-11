import asyncHandler from "express-async-handler";
import admin from "../config/firebaseAdmin.js";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  const decodedToken = await admin.auth().verifyIdToken(token);

  req.firebaseUser = decodedToken;

  const user = await User.findOne({
    firebaseUid: decodedToken.uid,
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.accountStatus !== "active") {
    res.status(403);
    throw new Error("Account is inactive");
  }
  req.user = user;

  next();
});

export { protect };
