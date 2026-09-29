const Note = require("../schema/noteschema");

async function createNote (req,res){
    try {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            message: "Title and content are required"
        });
    }

    const newNote = new Note({ title, content });

    await newNote.save();

    res.status(201).json(newNote);
} catch (error) {
    res.status(500).json({
        message: error.message
    });
}
}


async function getNotes(req,res){
    try {
    const notes = await Note.find().sort({ createdAt: -1 });

    res.status(200).json(notes);
} catch (error) {
    res.status(500).json({
        message: error.message
    });
}
}


async function updateNote(req,res){
    try {
       const {title,content}=req.body
       const updatedNote= await Note.findByIdAndUpdate(req.params.id,{title,content},{ returnDocument: "after" }) 
       if(!updatedNote){
        return res.status(404).json({message:"note not updated"})
       }
       res.status(200).json(updatedNote)
    } catch (error) {
        res.status(500).json({
        message: error.message
    });
    }
}
async function deleteNote(req,res){
    try {
       const deletedNote= await Note.findByIdAndDelete(req.params.id) 
       if(!deletedNote){
        return res.status(404).json({message:"note not deleted"})
       }
       res.status(200).json(deletedNote)
    } catch (error) {
        res.status(500).json({
        message: error.message
    });
    }
}


module.exports={createNote,getNotes,updateNote,deleteNote}