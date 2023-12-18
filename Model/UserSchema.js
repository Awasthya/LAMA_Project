const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    projectName : {
        type : String,
        require : true
    },
    Files : [{
        FileName : {
            type : String,
            require : true
        },
        FileLink : {
            type : String, 
            require : true
        },
        FileUploadDate : {
            type : String,
            reuqire : true
        },
        FileTimeStamp : {
            type : String,
            reuqire : true
        }
    }]

})
//addAppointmentInExistUser

userSchema.methods.addFilesInExistUser  = async function ( id, projectName, ProjectLink, date, time ) {
    try{
        this.Files = this.Files.concat({ id, FileName : projectName, FileLink : ProjectLink,FileUploadDate : date, FileTimeStamp : time});
        await this.save();
        console.log('added');
        return this.Files;
    }catch(err) {
        console.log(err);
    }
}
const User = mongoose.model('USER',userSchema);
module.exports = User;