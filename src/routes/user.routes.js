import {Router} from "express"
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(
    //bich me middleware lga diye
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

// POST /login request aane par loginUser controller run hoga.
// Login ke liye user ko pehle se authenticated hone ki zarurat nahi hai.
// loginUser database me user ko find karega, password check karega,
// aur access token + refresh token generate karega.
router.route("/login").post(loginUser);

// router.route("/login").post((req, res) => {
//   console.log("Login route hit");
//   res.send("login route working");
// });
//ye just to check 

// verifyJWT ek middleware hai.
// Ye pehle check karega ki user ke paas valid access token hai ya nahi.
// Token valid hua to req.user me user data attach karega.
// Uske baad next() call karke logoutUser controller ko access dega. to ab uske paas bhi user ka access hai 
// Agar token invalid ya missing hua to logoutUser tak request nahi jayegi
// aur 401 Unauthorized error milega.
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);


export default router 

// This code creates a router for handling user-related API endpoints in an Express application.
// First, Router is imported from Express and a new router instance is created using const router = Router();.
//   Then, the registerUser controller is imported from the controllers folder. 
//   The line router.route("/register").post(registerUser) defines a
//    route that listens for POST requests on the /register endpoint and forwards those 
//    requests to the registerUser controller, where the 
//    actual registration logic (validation, database operations, token generation, etc.) is executed.
//    Finally, export default router exports the router so it can be imported into app.js 
//    and attached to a base path such as app.use("/api/v1/users", userRouter). As a result,
//   the complete endpoint becomes POST /api/v1/users/register, 
// where the route receives the request and the controller performs the registration process.



// NOTE:
// Route ka kaam sirf request ko correct controller tak pahunchana hota hai.
// Jab client POST /api/v1/users/register request bhejta hai,
// to ye route match hota hai.

// Pehle upload.fields() middleware run hota hai.
// Ye uploaded files ko process karke req.files me store karta hai.

// Middleware complete hone ke baad registerUser controller run hota hai.

// Database operations (User.findOne, User.create, User.findById, etc.)
// routes me nahi hote, controller ke andar hote hain.

// Example:
// POST /api/v1/users/register
// → Route match
// → Multer middleware run
// → registerUser controller run
// → User.create() database me user save karta hai
// → Response send hota hai

// Isi tarah login route loginUser controller ko call karta hai,
// aur loginUser ke andar User.findOne() database se user fetch karta hai.

// Route = URL mapping
// Middleware = Request processing/checks
// Controller = Logic
// Model = Database interaction