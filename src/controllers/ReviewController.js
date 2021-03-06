const userModel=require("../models/UserModel")
const bookModel=require("../models/BookModel")
const reviewModel=require("../models/ReviewModel")

const validator=require("../validators/validators");



const reviewbook = async function (req, res) {
    try {
      let data = req.body;

      
if(!validator.isValidRequestBody(data)){

  return res.status(400).send({status:false,msg:"no review details given"})
}



     data.bookId=req.params.bookId
     if(!validator.isValidObjectId(data.bookId))
    {

        return res.status(400).send({status:false,msg:"bookId is not valid ObjectId"})
    }

     let search=await bookModel.findById(data.bookId)
    
    if(!search) return res.status(404).send({status:false,message:"Invalid BookId"})

    if(search.isDeleted==true) return res.status(400).send({status:false,message:"Book is already deleted"})
    // console.log(data.reviewedBy)
     if(data.reviewedBy)
    
    {
        if(typeof data.reviewedBy ==='string' && data.reviewedBy.trim().length===0) 
        return res.status(400).send({status:false,message:"reviewdBy is not valid"})
    }
    // console.log(data.reviewedBy)
    if(!data.reviewedBy)
    {
        data.reviewedBy="Guest"
    }
    
    if(!validator.isValid(data.rating))
    {

        return res.status(400).send({status:false,msg:"rating is not valid"})
    }
    if(data.rating<1||data.rating>5)
    {
      return res.status(400).send({status:false,message:"Invalid rating"})

    }
   
    data.reviewedAt=Date.now()
   if(data.isDeleted==false||(!data.isDeleted))
  { await bookModel.findByIdAndUpdate(
           data.bookId,
           {
               $inc:{reviews:1}
           },
           {new:true}
      )
          }



    let review=await reviewModel.create(data)
    
    
    const finalData=await reviewModel.findById(review._id).populate('bookId');
        
    res.status(201).send({status:true,message:"success",data:finalData})
     
        
    } catch (error) {
      res.status(500).send({ status: false, msg: error.message });
    }
  };


  const updatereview = async function (req, res) {
    try {
      let data = req.body;
     console.log(data)
    let bookId=req.params.bookId

    let reviewId=req.params.reviewId
      if(!validator.isValidRequestBody(data)){

        return res.status(400).send({status:false,msg:"no updatereview details given"})
      }
      let x= Object.keys(data)

for (let index = 0; index < x.length; index++) {
if(x[index]!="rating")
{ 
 if(x[index]!="review"){
   if(x[index]!="reviewedBy")
   {
     return res.status(400).send({status:false,message:"Invalid Parameter in body is being provided"})
   }
 }
  
}
}
    
     

     if(!validator.isValidObjectId(bookId))
    {

        return res.status(400).send({status:false,msg:"bookId is not valid ObjectId"})
    }
   
  
     if(!validator.isValidObjectId(reviewId))
    {

        return res.status(400).send({status:false,msg:"reviewId is not valid ObjectId"})
    }

     
     let search=await bookModel.findById(bookId)
    
    if(!search) return res.status(400).send({status:false,message:"Invalid BookId"})

    if(search.isDeleted==true) return res.status(404).send({status:false,message:"Book is already deleted"})


    let reviewsearch=await reviewModel.findById(reviewId)
    
    if(!reviewsearch) return res.status(400).send({status:false,message:"Invalid reviewId"})

    if(reviewsearch.isDeleted==true) return res.status(404).send({status:false,message:"review is already deleted"})


    if(data.reviewedBy)
    
    {
        if(typeof data.reviewedBy ==='string' && data.reviewedBy.trim().length===0) 
        return res.status(400).send({status:false,message:"reviewdBy is not valid"})
    }
    
     
    
    if(data.rating)
    
    {
        if(typeof data.rating !=='number') 
        return res.status(400).send({status:false,message:"rating is not valid"})
        if(data.rating<1||data.rating>5)
        {
          return res.status(400).send({status:false,message:"Invalid rating"})
    
        }
    }


   
   
   
    data.reviewedAt=Date.now()
    let condition =await reviewModel.findOne({_id:reviewId,bookId:bookId,isDeleted:false})
    if(!condition) return res.status(404).send({status:false,message:"No Document Found"})
  
    let update= await reviewModel.findByIdAndUpdate(
           reviewId,
            
           {
              $set: data
           },
           {new:true}
      ).select({__v:0,isDeleted:0})


console.log(update)
    
    res.status(200).send({status:true,message:"sucessful",data:update})
     

    
        
    } catch (error) {
      res.status(500).send({ status: false, msg: error.message });
    }
  };


  const deletereview = async function (req, res) {
    try {
     
    
     let bookId=req.params.bookId
    //  console.log(bookId)
     let reviewId=req.params.reviewId


     if(!validator.isValidObjectId(bookId))
     {
 
         return res.status(400).send({status:false,msg:"bookId is not valid ObjectId"})
     }
     //  console.log(bookId)
      
 
      if(!validator.isValidObjectId(reviewId))
     {
 
         return res.status(400).send({status:false,msg:"reviewId is not valid ObjectId"})
     }

     
     let search=await bookModel.findById(bookId)
    
    if(!search) return res.status(400).send({status:false,message:"Invalid BookId"})

    if(search.isDeleted==true) return res.status(404).send({status:false,message:"Book is already deleted"})


    let reviewsearch=await reviewModel.findById(reviewId)
    
    if(!reviewsearch) return res.status(400).send({status:false,message:"Invalid reviewId"})

    if(reviewsearch.isDeleted==true) return res.status(404).send({status:false,message:"review is already deleted"})

let condition =await reviewModel.findOne({_id:reviewId,bookId:bookId,isDeleted:false})
if(!condition) return res.status(404).send({status:false,message:"No Document Found"})
    
    let update= await reviewModel.findOneAndUpdate(
      {_id:reviewId,bookId:bookId},
      {
         $set: {isDeleted:true}
      },
      {new:true}
 )
 await bookModel.findByIdAndUpdate(
  bookId,
  {
      $inc:{reviews:-1}
  },
  {new:true}
)


    
    res.status(200).send({status:true,message:"sucessful",data:"Review is being deleted"})
     

    
        
    } catch (error) {
      res.status(500).send({ status: false, msg: error.message });
    }
  };
    





module.exports.deletereview=deletereview
 module.exports.updatereview=updatereview
  module.exports.reviewbook=reviewbook