//it only creates a method and export it 


//promises method
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}
// Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)) 
// executes the controller function and converts its result into a Promise.
//  If the controller runs successfully, nothing special happens and the response is sent normally. 
// However, if any error occurs during execution, the Promise is rejected and the .catch() block runs.
// The error is then passed to next(err), which forwards it to Express’s error-handling middleware.
// This allows centralized error handling and eliminates the need to write separate try...catch 
// blocks in every async controller.

export { asyncHandler }
 



// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
    //one function pass into other function
// const asyncHandler = (func) => async () => {}

//try catch method
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }

// The catch block acts as a safety net for asynchronous operations.
//  If any error occurs while executing the controller function fn(req, res, next)—such as a database failure, 
// invalid data, or any unexpected exception—JavaScript immediately stops normal execution and jumps to the catch block. 
// Inside it, we create a proper error response instead of letting the server crash. 
// res.status(error.code || 500) sets the HTTP status code (using a custom error code if available,
//  otherwise 500 for Internal Server Error),
//  and .json({ success: false, message: error.message }) sends a structured JSON response to the client containing information about what went wrong.
//  This ensures that errors are handled gracefully and consistently across the application.