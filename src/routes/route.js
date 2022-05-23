const express = require('express');
const router = express.Router();
const userController= require("../controllers/UserController")
const bookController=require("../controllers/BookController")
const reviewController=require("../controllers/ReviewController")
 const {auth1,auth2}=require('../middleware/middleware')
 const awsController=require("../controllers/awsController")
 


 router.post("/register", userController.createUser)
 router.post("/login",userController.login)

 router.post("/books",auth1,bookController.createbooks)
 router.get("/books",auth1,bookController.getbooks)
 router.get("/books/:bookId",auth1,bookController.getbooksbyId)
 router.put("/books/:bookId",auth1,auth2,bookController.updatebook)
 router.delete("/books/:bookId",auth1,auth2,bookController.deletebook)


router.post("/books/:bookId/review",reviewController.reviewbook)
router.put("/books/:bookId/review/:reviewId",reviewController.updatereview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deletereview)

router.post("/write-file-aws",awsController.sdk )

module.exports = router;