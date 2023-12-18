
const express = require('express') 
const app = express();
const path = require('path');
require('./DB/Conn');
const router = require('./Router/router.js');
app.use(express.json())
const PORT = process.env.PORT || 5000;
app.use(router);

if (process.env.NODE_ENV === "production") {
        app.use(express.static(path.join('./FrontEnd/build')));
}
app.get('*',function(req,res)  {
        res.sendFile(path.join(__dirname, './FrontEnd/build/index.html'))
})

//listen Port 
app.listen(PORT,()=>{
        console.log('Server is Started....')
})