// Custom error class for sending structured errors
import { ApiError } from "../utils/ApiError.js";

// Wrapper function jo async errors ko automatically handle karta hai
import { asyncHandler } from "../utils/asyncHandler.js";

// JWT package token verify karne ke liye
import jwt from "jsonwebtoken";

// User model database se user fetch karne ke liye
import { User } from "../models/user.model.js";

/*
  verifyJWT middleware

  Purpose:
  - Check karega ki user logged in hai ya nahi
  - Access token valid hai ya nahi
  - Token ke andar jo user id hai us user ko database se fetch karega
  - User data req.user me attach karega
  - Fir next() se protected route ko access dega
*/
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    /*
      Access token ko do jagah se dhoondho:

      1. Cookies se
         req.cookies.accessToken

      2. Authorization header se
         Bearer xxxxxxxxxxx

      Example:
      Authorization: Bearer eyJhbGciOiJI...

      replace("Bearer ", "")
      => Sirf token bacha dega
    */
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // Debugging ke liye token dekh sakte ho
    // console.log(token);

    /*
      Agar token hi nahi mila
      matlab user logged in nahi hai

      Example:
      Authorization header missing
      Cookie missing
    */
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    /*
      Token verify karo

      jwt.verify() check karta hai:
      - Token original hai ya nahi
      - Secret key se sign hua tha ya nahi
      - Expire to nahi hua

      Agar token valid hua to payload return karega

      Example payload:

      {
        _id: "6890abc123",
        email: "john@gmail.com",
        iat: 123456,
        exp: 123456
      }
    */
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    /*
      Token ke andar stored user id nikalo
      aur database me us user ko search karo

      decodedToken._id

      Password aur refreshToken return nahi karenge
      security reasons ki wajah se
    */
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    /*
      Ho sakta hai token valid ho
      lekin user database se delete ho gaya ho

      Is case me access deny kar denge
    */
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    /*
      User mil gaya

      User object ko request me attach kar do

      Ab aage kisi bhi controller me access kar sakte hain:

      req.user._id
      req.user.username
      req.user.email
    */
    req.user = user;

    /*
      Middleware successfully complete ho gaya

      Ab next middleware ya controller execute hoga

      Flow:

      Request
         ↓
      verifyJWT
         ↓
      Protected Controller
    */
    next();
  } catch (error) {
    /*
      Yaha control aayega agar:

      - Token invalid ho
      - Token expire ho
      - Wrong secret use hua ho
      - User na mile

      User ko 401 Unauthorized bhejenge
    */
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
