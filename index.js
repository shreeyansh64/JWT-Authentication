const exp = require('express');
const mon = require('mongoose');
const jwt = require('jsonwebtoken');
const jwtpass = "thisisasec"
const port = process.env.PORT || 3000;
const app = exp();

mon.connect('mongodb+srv://admin:12ka442ka1@cloudclus.hlbugrd.mongodb.net/userinfo?retryWrites=true&w=majority&appName=Cloudclus');

const User = mon.model('Users',{
    username : String,
    pass : String
});

app.use(exp.json());

app.get('/',(req,res)=>{
    res.status(200).send("Connected Successfully !!")
})

app.post('/signup',async function(req,res){
    const uname = req.body.user;
    const upass = req.body.pass;
    const existinguser = await User.findOne({ username : uname});
    if(existinguser){
        res.status(400).json({
            Error : "Username already exists"
        })
    }
    const adduser = new User({
        username : uname,
        pass : upass
    })
    adduser.save();
    res.status(200).send("Welcome aboard "+uname+" ! You can now proceed to login");
})

app.post('/login',async function(req,res){
    const username = req.body.user;
    const passwd = req.body.pass;
    const dbinfo = await User.findOne({
        username: username
    })
    if(!dbinfo){
        res.status(404).json({
            Error : "Invalid User"
        })
    }
    if(!dbinfo.username == username || !dbinfo.pass == passwd){
        res.status(403).json({
            Error:"Incorrect Credentials"
        })
    }
    let token = jwt.sign({username : username},jwtpass);
    res.status(200).json({
        token
    })

})

app.get('/normal',(req,res)=>{
    try{
        const token = req.headers.authorization;
        const decode = jwt.verify(token,jwtpass);
        const username = decode.username;
        res.status(200).send("It all works !!");
    }catch(err){
        res.status(403).json({
            Error:"Authorization failure."
        })
    }
})

app.use(function(err,req,res,next){
    res.status(500).json({
        "Error":"Something is up with up servers"
    })
})

app.listen(port,()=>{
    console.log(`[+] Listening on port ${port}`)
})
