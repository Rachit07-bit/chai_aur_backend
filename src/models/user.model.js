import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,   // agar searching enable karni hai 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


// ================= MIDDLEWARE 1 =================

// This middleware runs automatically before a user document is saved.
// It is commonly used to perform tasks like hashing passwords
// before storing them in the database.
userSchema.pre("save", async function (next) {

  // Check if the password field was modified.
  //
  // Examples:
  // 1. New user registration -> password is new -> modified -> hash it.
  // 2. Updating username/email only -> password unchanged -> don't hash again.
  //
  // Without this check, every save operation would hash the already
  // hashed password again, making login impossible.
  if (!this.isModified("password")) return ;

  // Convert the plain-text password into a secure hashed password.
  //
  // Example:
  // "mypassword123"
  // becomes
  // "$2b$10$K8xj..."
  //
  // 10 is the salt rounds value:
  // Higher value = more secure but slower hashing.
  this.password = await bcrypt.hash(this.password, 10);

  // Tell Mongoose that this middleware has finished
  // and it can continue saving the document.
  
});

// Notes:
// • Mongoose pre middleware supports callback-based and async/await styles.
// • When using async function, next() is not required.
// • Mongoose automatically waits for the async function to complete.
// • Using next() with async middleware may cause: TypeError: next is not a function.
// • Removing next() does not affect password hashing.
// • Removing next() does not affect user registration.
// • Removing next() does not affect login functionality.
// • Modern Mongoose projects prefer async/await middleware without next().

//pta nhi isme error aa rha tha
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });


// ================= MIDDLEWARE 2 =================

// This is a custom schema method used during login.
//
// Purpose:
// Compare the password entered by the user with the
// hashed password stored in the database.
//
// Example:
//
// User enters:
// "mypassword123"
//
// Database contains:
// "$2b$10$K8xj..."
//
// bcrypt.compare() hashes the entered password internally
// and checks whether both passwords match.
//
// Returns:
// true  -> password is correct
// false -> password is incorrect
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
  //this.password encypted wla
};



// ================= MIDDLEWARE 3 =================

// This method generates an Access Token.
//
// Access Token:
// - Used to authenticate API requests.
// - Sent by the frontend with every protected request.
// - Usually has a short expiry time.
//
// We store basic user information inside the token
// so that the server can identify the user without
// querying the database repeatedly.
userSchema.methods.generateAccessToken = function () {
  // We use a normal function instead of an arrow function
  // because we need access to `this`.
  //
  // Here, `this` refers to the current user document.
  //
  // Example:
  // this._id
  // this.email
  // this.username
  //
  // Arrow functions do not have their own `this`.
  // They inherit `this` from the surrounding scope,
  // so `this._id`, `this.email`, etc. would not work as expected.
  
  return jwt.sign(
    {
      // User information stored inside token payload
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },

    // Secret key used to sign the token
    process.env.ACCESS_TOKEN_SECRET,

    {
      // Token validity period
      // Example: 1d, 15m, 7d
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

//hum arrow function ki jgh function () {} use kar rhe hain taaki this krke sbko use kr paae



// ================= MIDDLEWARE 4 =================

// This method generates a Refresh Token.
//
// Refresh Token:
// - Has a longer expiry than Access Token.
// - Used to generate a new Access Token when the old one expires.
// - Keeps users logged in without asking them to login again.
//
// Unlike Access Token, we store only the user's _id
// because this token is only used to identify the user
// when generating a new Access Token.
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      // Minimal information needed to identify user
      _id: this._id,
    },

    // Secret key used specifically for refresh tokens
    process.env.REFRESH_TOKEN_SECRET,

    {
      // Longer expiry time
      // Example: 7d, 30d
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
