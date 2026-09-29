const express= require('express')
const router=express.Router()
const noteController=require('../controllers/note.controller')



router.post('/create' , noteController.createNote)
router.get('/get' , noteController.getNotes)
router.put('/update/:id',noteController.updateNote )
router.delete('/delete/:id',noteController.deleteNote )


module.exports=router