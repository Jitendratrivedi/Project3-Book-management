const userModel=require("../models/UserModel")
const bookModel=require("../models/BookModel")
const reviewModel=require("../models/ReviewModel")
const jwt=require("jsonwebtoken")
const moment=require("moment")



const validator=require("../validators/validators");



const createbooks = async function (req, res) {
    try { 
      let data = req.body;
     
      let decodedtoken= req.decodedtoken
      //VALIDATION
  
      if(!validator.isValidRequestBody(data)){

        return res.status(400).send({status:false,msg:"No Book details given"})
    }

 
    
    
    if(!validator.isValid(data.title)){

        return res.status(400).send({status:false,msg:"title is not valid"})
    }
    let checktitle=await bookModel.findOne({title:data.title})
    if(checktitle)
    {
    return res.status(400).send({status:false,msg:"title already exists"})
    }
     
    if(!validator.isValid(data.excerpt))
    {

        return res.status(400).send({status:false,msg:"excerpt is not valid"})
    }
     
    
    
    if(!validator.isValidObjectId(data.userId))
    {

        return res.status(400).send({status:false,msg:"userId is not valid ObjectId"})
    }
    
    
    if(!validator.isValid(data.userId))
    {

        return res.status(400).send({status:false,msg:"userId is not valid"})
    }
    
    
    
      if(!validator.isValid(data.ISBN))
    {

        return res.status(400).send({status:false,msg:"ISBN is not valid"})
    }
    
    let checkISBN=await bookModel.findOne({ISBN:data.ISBN})
    
    if(checkISBN)
    {
    return res.status(400).send({status:false,msg:"ISBN already exists"})  
    }
     

    if(!validator.isValid(data.category))
    {

        return res.status(400).send({status:false,msg:"category is not valid"})
    }
  
    if(!validator.isValid(data.subcategory))
    {

        return res.status(400).send({status:false,msg:"subcategory is not valid"})
    }
     
    if(!validator.isValid(data.releasedAt))
    {

        return res.status(400).send({status:false,msg:"releasedAt is not valid or not provided"})
       
    }


   if(data.releasedAt)
   {  
     let c= moment(data.releasedAt, "YYYY-MM-DD").isValid()
     if(c==false)
    return res.status(400).send({status:false,msg:"releasedAt format is not valid"})
    
    
   }
  
     

    // data.releasedAt= moment().format();

    if(decodedtoken.userId !== data.userId) 
      
    {
    return res.status(401).send({status:false,msg : "YOU ARE NOT AUTHORIZED TO CREATE BLOG WITH THIS AUTHOR ID"})
      
    }

  
      //LOGIC
      let condition = await userModel.findById(data.userId);
      if (condition) 
      {
        
        if(data.isDeleted==true)
        {
            data.deletedAt=moment().format();
        
        }
       
          let savedData = await bookModel.create(data);
          res.status(201).send({ status: true,data: savedData });
        
      } else {
        res.status(404).send({ status: false, msg: "authorId does not found in Database" });
      }
    } catch (error) {
      res.status(500).send({ status: false, msg: error.message });
    }
  };
// ----------------------------------------------------------------------------------------------------
  const getbooks = async function (req, res) {
    try {
      let data = req.query;
     
      let x= Object.keys(data)

      
      
     if(Object.keys(data).length==0)
     { 
        
        let findbooks= await bookModel.find()
        .select({_id:1,title:1,excerpt:1,userId:1,category:1,reviews:1,releasedAt:1}).sort({title:1})

    
        return res.status(200).send({ status: true,message:"Bookslists", data:findbooks });
     } 

     
     for (let index = 0; index < x.length; index++) {
        
      if(x[index]!="category")
       { 
        if(x[index]!="subcategory"){
          if(x[index]!="userId")
          {
            return res.status(400).send({status:false,message:"Invalid query is being provided"})
          }
        }
         
       }
      
    }
   
   
      let getData = await bookModel.find({
        $and: [ data,{isDeleted:false}]
      }).select({_id:1,title:1,excerpt:1,userId:1,category:1,reviews:1,releasedAt:1}).sort({title:1})

      if (getData.length === 0) {
        return res.status(404).send({
          status: false,
          msg: "All books are either deleted or does not match given query", 
        });
      }else
      {
          
      res.status(200).send({ status: true,message:"Bookslists", data: getData });
    
       }
    } catch (error) {
      res.status(500).send({ status: false, msg: error.message });
    }
  };

// ---------------------------------------------------------------------------------------------------------------




const getbooksbyId = async function (req, res) {
  try {
    let data = req.params.bookId;


    if(!validator.isValidObjectId(data))
    {

        return res.status(400).send({status:false,msg:"bookId is not valid ObjectId"})
    }


    let books= await bookModel.findOne({_id:data,isDeleted:false})
    
    if(!books) return res.status(404).send({stats:false,message:"No book found or already deleted"})
   
    
    let x=JSON.parse(JSON.stringify(books))
    x.reviewsData= await reviewModel.find({bookId:data,isDeleted:false}).select({bookId:1,reviewedBy:1,reviewedAt:1,rating:1,review:1})
    
    res.status(200).send({status:true,message:"Books list",data:x})
    
   
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};


// -----------------------------------------------------------------------------------------------------------------

const updatebook = async function (req, res) {
  try {

    let getId = req.params.bookId;
    let data = req.body; 

    if(!validator.isValidObjectId(getId))
    {

        return res.status(400).send({status:false,msg:"bookId is not valid ObjectId"})
    }
   
    let checkId = await bookModel.findById(getId); //wa can use findOne also
    if (checkId) {
      if (checkId.isDeleted === false) {
        
        if(data.title){
        if(!validator.isValid(data.title)){

          return res.status(400).send({status:false,msg:"title is not valid"})
      }
    }
      
      if(data.ISBN){
      if(!validator.isValid(data.ISBN)){

        return res.status(400).send({status:false,msg:"ISBN is not valid"})
    }
  }
    if(data.excerpt){
    if(!validator.isValid(data.excerpt)){

      return res.status(400).send({status:false,msg:"excerpt is not valid"})
  }
}

        let conditiontitle=await bookModel.findOne({title:data.title})
        if(conditiontitle)
        {
          return res.status(400).send({status:false,message:"title is alredy taken"})
        }

        let conditionISBN=await bookModel.findOne({ISBN:data.ISBN})
        if(conditionISBN)
        {
          return res.status(400).send({status:false,message:"ISBN is alredy taken"})
        }



     if(data.releasedAt)
        {
          if(!validator.isvalidreleasedAt(data.releasedAt))
        {
         
          return res.status(400).send({status:false,msg:"releasedAt format is not valid"})
        
        }
        }

        let check = await bookModel.findByIdAndUpdate(//filer,update
          getId,
          {
            
            title: data.title,
            ISBN: data.ISBN,
            releasedAt: data.releasedAt,
            excerpt: data.excerpt,
            
          },
          { new: true }
        );
        //console.log(check);
        


        res.status(200).send({ status: true,message:"success", data: check });
      } else {
        res
          .status(404)
          .send({ status: false, msg: "Document not found as already deleted" });
      }
    } else {
      res
        .status(400)
        .send({ status: false, msg: "Please enter valid Book Id" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

// ---------------------------------------------------------------------------------------------------------


const deletebook = async function (req, res) {
  try {
    let bookId = req.params.bookId;

    let book = await bookModel.findById(bookId);

    if (!book) {
      return res.status(400).send("NOT A VALID Book ID");
    }
    if (book.isDeleted == false) {
      let save = await bookModel.findOneAndUpdate(
        { _id: bookId },
        {
          $set: { isDeleted: true, deletedAt: Date.now() },
        },
        { new: true }
      );

      // line 292 to 299 updated recently
      let update= await reviewModel.updateMany(
     {bookId:bookId},
     {
      $set: { isDeleted: true},
     },
     {new:true}

     )
       
      return res.status(200).send({status:true, msg : "Book IS  DELETED Along with its reviews" }); //cmd on sunday
    } else {
      res.status(404).send({ status: false, msg: "AlREADY DELETED" });
    }
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};




















module.exports.deletebook=deletebook
module.exports.updatebook=updatebook
module.exports.getbooksbyId=getbooksbyId
module.exports.getbooks=getbooks
module.exports.createbooks=createbooks
