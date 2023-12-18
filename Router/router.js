
const express = require('express') 
const User = require('../Model/UserSchema');
const router = express.Router();

const mongodb = require('mongodb')

router.get('/',(req,res) => {
    res.send('hello');
});

router.post('/createProject',async (req,res) => {

    const {projectName} = req.body;
    if(!projectName)
        return res.status(422).json({message : "Project Name Can't be empty"})

        // Find current user
        const projectExist = await User.find({projectName : projectName});
        if(projectExist.length !== 0){

            // If User Already Exist
            return res.status(422).json({message : "Project Is already exist please use new name"});
        }else{
            
            // If user not exist
            const user = new User({projectName});
            user.save().then(()=> {
                return res.status(200).json({message : "Project added"});
            }).catch((err) => {

                // If there is some Error
                return res.status(422).json({message : "Project is not added due to error"})
            });
        }


   // console.log(projectName);
});

router.get('/getProjects', async(req,res) => {

    const data = await User.find();
    return res.status(200).json(data);
})
// storeFiles

router.post('/storeFiles', async(req,res) => {
    const {id, projectName , ProjectLink} = req.body;
    const userExist = await User.findOne({_id : id})
    const date = JSON.stringify(new Date()).substr(1,10);
    const time = new Date().toLocaleTimeString();
    if(userExist){
        if(  !projectName  || !ProjectLink)
                return res.status(422).json({ message: "Fill all required fields" });
        const addAppointment = await userExist.addFilesInExistUser( id, projectName , ProjectLink,date , time);
        console.log(addAppointment);
        return res.status(200).json({ message: "Files Add Into Existing Projects" });
    }

    // console.log(user);
})

router.post('/getProjectFiles', async(req,res)=> {
    const {id}  = req.body;

    const user = await  User.findById( id);

    return res.status(200).json(user.Files);
})

router.get('/getDescription/:id/:fileId',async (req,res)=> {
    const {id,fileId} = req.params;
    const projectDetail = await  User.findById( id);
    let value;
    const file = await projectDetail.Files.map((file) => {
        const f = file._id.toString();
        if (f === fileId) 
            value = file.FileLink; 

    })  
    return res.status(200).json({description : value});
})
///updateDescription/${id}

router.post('/updateDescription/:id/:fileId',async (req,res)=> { 
    const {id,fileId} = req.params;
    const description = req.body.descript; 
    
    try{
    const userdata = await User.updateOne({
        _id : id
    }, {
        $set: {
            "Files.$[personal].FileLink":description
        }
    }, {
        arrayFilters: [
        {
        "personal._id" : fileId
        }
    ]})
    return res.status(201).json({ message : 'success', data: userdata });
} catch (e) {
    console.log(e)
    return res.status(422).json(e); 
}
})

///deleteOneFile/${projectid}/${FileId}

router.delete('/deleteOneFile/:projectid/:FileId',async (req,res)=> { 

    const {projectid,FileId} = req.params;
    console.log(projectid,FileId)

    const result = await User.updateOne(
        { "_id": new mongodb.ObjectId(projectid) },
        {
            $pull: { 'Files': {
                "_id": FileId}            
            }
        }
    )


    if(result.modifiedCount !== 0)
            console.log();
        else
            console.log("Document is Not Deleted")

    
            return res.status(200).json({message : "Documennt is Deleted"});        
})
module.exports = router;