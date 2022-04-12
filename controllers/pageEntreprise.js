const mongoose = require('mongoose')
const PageEntreprise = require('../models/PageEntreprise')
const { pageValidator } = require('../utilities/validators')


const creatPageEntreprise = async(req,res)=>{
    try {
        const validatorResult = pageValidator.validate(req.body, {abortEarly:false})
        if(validatorResult.error){
            return res.status(400).json(validatorResult)
        }
        const pageEntrepriseTitle = await PageEntreprise.findOne({title: req.body.title})
        if(pageEntrepriseTitle){
            return res.status(401).json({error: 'Please enter a valid company title'})
        }
        const {title, description, photo, contact }=req.body
        const pageEntreprise = await new PageEntreprise({
            title: title,
            description: description,
            photo: photo,
            contact: contact,
            user : req.user._id
        })
        const savedPage = await pageEntreprise.save()
        req.user.password = undefined
        req.user.__v = undefined
        savedPage.user = req.user
        res.status(201).json({
            message: "Page  created successfully",
            pageEntreprise: savedPage
        })
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports ={
    creatPageEntreprise
}