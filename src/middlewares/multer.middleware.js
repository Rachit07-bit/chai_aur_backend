// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// export const upload = multer({
//   storage,
// });

import multer from "multer";

// cb = callback function provided by Multer
// Syntax: cb(error, value)
// First argument (null)
// • No error occurred during file upload
// Second argument ("./public/temp")
// • Folder where Multer should save the uploaded file
// Tells Multer:
// • Upload successful till now
// • Store the file inside public/temp folder
// Example:
// cb(null, "./public/temp")
// => Save uploaded file in ./public/temp

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });

/*
==================== MULTER NOTES ====================

What is Multer?

- Multer is a middleware for handling file uploads in Express.

- It processes files sent through multipart/form-data requests.

- After processing, it makes uploaded files available in req.file or req.files.

Why do we need Multer?

- Express can read text data from req.body.

- Express cannot handle uploaded files by itself.

- Multer reads uploaded files and stores them on the server.

How does Multer work?

Client uploads file

        ↓

Route hits upload middleware

        ↓

Multer receives file

        ↓

Stores file in ./public/temp

        ↓

Adds file info to req.files

        ↓

Controller can access file path

Example:

Postman Form Data:

avatar -> profile.png

After Multer runs:

req.files = {

  avatar: [

    {

      originalname: "profile.png",

      path: "public/temp/profile.png"

    }

  ]

};

Now inside controller:

const avatarLocalPath = req.files?.avatar[0]?.path;

avatarLocalPath =

"public/temp/profile.png"

======================================================

*/