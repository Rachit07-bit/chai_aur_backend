// require('dotenv').config({path: './env'})
// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'

dotenv.config({
    path: './.env'
})

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

// import express from "express"
// const app=express()
// ( async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("errror", (error) => {
//             console.log("ERRR: ", error);
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })

//     } catch (error) {
//         console.error("ERROR: ", error)
//         throw err
//     }
// })()

//better approach yhi hai ki database se jb bhi baat kro aisa smj ke chalo ki
//database another continent me hain jisse error aa skte hain to try catch lagana hi hai
//or because another continent me hain to time bhi lgg skta ahi to async await lagana must hai
//ye keval smjhne ke liye context hai ki another continent mai hain

//  IIFE, it stands for Immediately Invoked Function Expression.
// It is a function that is defined and executed immediately after it is created.
