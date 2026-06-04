// Controllers contain the actual business logic of your application. 
// Routes decide which request should go where, while controllers decide what should happen
//  when that request arrives.
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
//isse local paths hi chiye thi dekh lo jaake cloudinary me upload karne ke liye 

import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req,res) => {
  //steps
  //get user details from frontend
  //validations - Not empty
  //check if user already exists
  //check for images,check for avatar
  //uplodem them to claudinary , avatar check
  //create user object - create entry in db
  //remove password and refresh token field from response
  //check for user responce
  //return response

  //                          step 1:get user details from frontend

  // Destructure the required fields from the request body
  const { fullName, email, username, password } = req.body;

  //                          step 2:validations - Not empty

  /*
  Validation:
  If any field is an empty string after removing spaces,
  throw an error.

  Example that will cause an error:
  req.body = {
    fullName: "John Doe",
    email: "john@gmail.com",
    username: "",          // Empty field ❌
    password: "123456"
  }

  Example that will also cause an error:
  req.body = {
    fullName: "   ",       // Only spaces ❌
    email: "john@gmail.com",
    username: "john123",
    password: "123456"
  }
*/
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //                        step 3:check if user already exists

  // User -> Mongoose Model (imported from user.model.js)
  // It represents the "users" collection in MongoDB

  // findOne() -> Mongoose method
  // Searches the database and returns the FIRST matching user document
  // If no user is found, it returns null

  const existedUser = await User.findOne({
    // $or means at least one condition must be true
    $or: [
      { username }, // Check if username already exists
      { email }, // Check if email already exists
    ],
  });

  /*
  Example:
  Database:
  {
    username: "john123",
    email: "john@gmail.com"
  }

  New Registration:
  {
    username: "john123",
    email: "new@gmail.com"
  }

  Since username already exists,
  findOne() returns that user document.

  existedUser = {
    username: "john123",
    email: "john@gmail.com"
  }
*/

  /*
  If a matching user is found,
  prevent duplicate registration.

  409 = Conflict
  (Resource already exists)
*/
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  /*
  If no matching user exists:

  existedUser = null

  The if condition becomes false,
  and registration continues.
*/

  //                           step 4:check for images,check for avatar

  const avatarLocalPath = req.files?.avatar[0]?.path;
  /*
  upload.fields() in user.routes.js processes the uploaded files
  and stores their information inside req.files.

  Example:

  req.files = {
    avatar: [
      {
        filename: "avatar.png",
        path: "public/temp/avatar.png"
      }
    ],
    coverImage: [
      {
        filename: "cover.jpg",
        path: "public/temp/cover.jpg"
      }
    ]
  }

  req.files?.avatar -> Access the files uploaded in the "avatar" field
  [0]                -> Get the first avatar file (maxCount is 1)
  ?.path             -> Get the local path of that file
  Result:
  avatarLocalPath = "public/temp/avatar.png"       //local path kyuki abhi server me hi hai
  If no avatar was uploaded, avatarLocalPath becomes undefined
  instead of throwing an error because of optional chaining (?.).
*/
  // to pura mtlb yhi hai ki req.files me se avatar ke first field ka local path kya hai yhi likha hai
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  //mai assume krr rha hun ki req.files hun to coveriamge hogi uska pehle ka path lelo 

  //avatar ko to maine user define karne se pehle check krr liya ki hai ya nhi hai but coverImage ko nhi kiya hai 
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  //isse error nhi aaega agar coverImage nhi bhejte to 


  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  //                                  step 5 : uplodem them to claudinary , avatar check
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  //kyuki jahir si baat hai upload hone me time to lagaega hi
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  //                                      step 6:create user object - create entry in db
const user = await User.create({
  // await because database se le rhe ho chijen jo ki dusre continent me hai to time lg skta hai 
  fullName,
  avatar: avatar.url,       //avatar ka url bss store karana chahte hain 
  coverImage: coverImage?.url || "",    //mila url to wo nhi to empty 
  email,
  password,
  username: username.toLowerCase(),
});

//ye method se hum pta kar skte hain ki apna user create hua ya nhi 

/*

  After creating the user, fetch the same user again from the database.

  user._id -> Unique MongoDB ID of the newly created user.

  findById(user._id)

  - Searches the users collection for the user with this ID.

  - Returns the complete user document if found.

  select("-password -refreshToken")

  - Excludes (removes) the password field from the result.

  - Excludes the refreshToken field from the result.

  - The '-' sign means "do not include this field".

  Example:

  User in DB:

  {

    _id: "6890abc123",

    fullName: "John Doe",

    email: "john@gmail.com",

    username: "john123",

    password: "hashedPassword",

    refreshToken: "xyz123"

  }

  Result stored in createdUser:

  {

    _id: "6890abc123",

    fullName: "John Doe",

    email: "john@gmail.com",

    username: "john123"

  }

  password and refreshToken are removed for security reasons.

*/

const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
);

if (!createdUser) {
  throw new ApiError(500, "Something went wrong while registering the user");
}

return res
  .status(201)
  .json(new ApiResponse(200, createdUser, "User registered Successfully"));



  // res.status(200).json({
  //     message:"ok"
  // })
})

export {registerUser}
