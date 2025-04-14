const { ALL } = require('dns');
const exp = require('express');
const jwt = require('jsonwebtoken');
const jwtpass = "123456";
const app = exp();
const port = process.env.PORT || 3000;

app.use(exp.json());

const ALL_USERS = [
    {
        username : "golu",
        pass : "zeus20659",
        name : "Shreeyansh"
    },
    {
        username : "nishu",
        pass : "zeret",
        name : "Shivansh"
    },
    {
        username : "manny",
        pass : "abraxos",
        name : "Mannat"
    }
]

function checkuser(user,pass){
    let userexist = false;
    for(let i =0; i<ALL_USERS.length;i++){
        if(ALL_USERS[i].username == user && ALL_USERS[i].pass == pass){
            userexist = true;
        }
    }
    return userexist;
    }

app.get('/',(req,res)=>{
    res.send("Connected Successfully 🎉, Kindly move to the signin page")
})

app.post('/signin',function(req,res){
    const username = req.body.username;
    const pass = req.body.pass;

    if(!checkuser(username,pass)){
        return res.status(403).json({
            "Error" : "User does not exist"
        });
    }

    var token = jwt.sign({username : username},jwtpass);
    return res.status(200).json({
        token
    })
})

app.get('/users',function(req,res){
    const token = req.headers.authorization;
    try{
        const decoded = jwt.verify(token,jwtpass);
        const username = decoded.username;
        return res.json({
            users : ALL_USERS.filter(function(val){
                if(val.username == username){
                    return false;
                }else{
                    return true;
                }
            })
        })
    }catch(err){
        return res.status(403).json({
            "Error":"Invalid token"
        })
    }
})


app.use((err,req,res,next)=>{
    req.status(500).json({
        "Error" : "There seems to be a problem with our server"
    })
})

app.listen(port,()=>{
    console.log(`[+] Listening on port ${port}`)
})
