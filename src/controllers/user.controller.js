// Controllers contain the actual business logic of your application. 
// Routes decide which request should go where, while controllers decide what should happen
//  when that request arrives.
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler( async (req,res) => {
    res.status(200).json({
        message:"ok"
    })
})

export {registerUser}
