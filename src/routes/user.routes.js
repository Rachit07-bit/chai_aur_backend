import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"

const router = Router();
router.route("/register").post(registerUser)


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