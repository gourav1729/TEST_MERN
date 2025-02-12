const Recipes=require("../models/recipe")
const multer  = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const publicPath = path.join(__dirname, '../../public/images')
      cb(null, publicPath)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + path.extname(file.originalname))
    }
  })

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Not an image! Please upload an image.'), false)
  }
}

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

const getRecipes=async(req,res)=>{
    const recipes=await Recipes.find()
    return res.json(recipes)
}

const getRecipe=async(req,res)=>{
    const recipe=await Recipes.findById(req.params.id)
    res.json(recipe)
}

const addRecipe=async(req,res)=>{
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" })
        }

        const {title, ingredients, instructions, time} = req.body 

        if(!title || !ingredients || !instructions) {
            return res.status(400).json({message: "Required fields can't be empty"})
        }

        const newRecipe = await Recipes.create({
            title,
            ingredients,
            instructions,
            time,
            coverImage: req.file.filename,
            createdBy: req.user.id
        })

        return res.json(newRecipe)
    } catch (error) {
        console.error('Error adding recipe:', error)
        return res.status(500).json({ message: "Error uploading image" })
    }
}

const editRecipe=async(req,res)=>{
    const {title,ingredients,instructions,time}=req.body 
    let recipe=await Recipes.findById(req.params.id)

    try{
        if(recipe){
            let coverImage=req.file?.filename ? req.file?.filename : recipe.coverImage
            await Recipes.findByIdAndUpdate(req.params.id,{...req.body,coverImage},{new:true})
            res.json({title,ingredients,instructions,time})
        }
    }
    catch(err){
        return res.status(404).json({message:err})
    }
    
}
const deleteRecipe=async(req,res)=>{
    try{
        await Recipes.deleteOne({_id:req.params.id})
        res.json({status:"ok"})
    }
    catch(err){
        return res.status(400).json({message:"error"})
    }
}

module.exports={getRecipes,getRecipe,addRecipe,editRecipe,deleteRecipe,upload}