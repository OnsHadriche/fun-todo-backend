
const Category = require("../models/Category")


const createCategory = async(req,res)=>{
    try {
        const {name} = req.body
        const category = await Category.findOne({name})
        if (category){
           res.status(404).json({error: 'Category is exsist'})
           return;
        }
       const newCategory= await new Category ({
            name:req.body.name
        }).save()
        res.status(201).json(newCategory)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
const getAllCategories = async(req, res)=>{
    try {
        const allCategories = await Category.find()
        res.status(201).json(allCategories)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
 const getCategoryById = async (req, res)=>{
     try {
         const categoryById = await Category.findById(req.params.id)
         if (!categoryById){
            res.status(404).json({error: 'Category not founded'})
            return;
         }
         res.status(201).json(categoryById)
     } catch (error) {
         res.status(500).json({error: error.message})
     }
 }
 module.exports={
     createCategory,
     getAllCategories,
     getCategoryById
 }