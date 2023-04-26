const express = require('express');
const app = express();

const MongoStore = require('connect-mongo');

const rounding = 12;

const bcrypt = require('bcrypt');

const port = 3000;

var {database} = include('databaseConnection');

const userCollection = database.db(mongodb_database).collection('users');

app.use(express.urlencoded({extended: false}));

app.get('/', (req,res) => {
    res.send(`
    <form action = '/signup' method ='get'>
    <button>Sign Up</button> 
    </form>

    <form action = '/login' method ='get'>
        <button>Log In</button>
    </form>`);
});


app.get('/signup',(req,res) => {
    var form = `
    Create User:
    <form action='/submitUserSignup' method='post'>
        <input name='username' type='text' placeholder='name'>
        <p>\n</p>
        <input name='email' type='text' placeholder='email'>
        <p>\n</p>
        <input name='pwd' type='text' placeholder='password'>
        <p>\n</p>
        <button>Submit</button>
    </form>`
    res.send(form);
    
})


app.get('/userInfo', (req,res) => {
    var missingInfo = req.query.missing;
    if (missingInfo == 'name') {
        var html = "<br> name is required";
    } else if(missingInfo == 'email'){
        var html = "<br> email is required";
    }else if(missingInfo == 'password'){
       var html = "<br> password is required";
    }
    html += `<br> <a style=color:blue; href= /signup>Try again</a>`
    res.send(html);
});

app.post('/submitUserSignup', async (req,res) => {
    var name = req.body.username;
    var email = req.body.email;
    var password = req.body.pwd;

    if (!name) {
        res.redirect('/userInfo?missing=name');
    } else if(!email){
        res.redirect('/userInfo?missing=email');
    } else if(!password){
        res.redirect('/userInfo?missing=password');
    }
    else {
        var hashedPassword = await bcrypt.hash(password, rounding);
	    await userCollection.insertOne({username: username, password: hashedPassword});
	    console.log("Inserted user");
        res.redirect(`/members`)
    }
});

app.get('/login',(req,res) => {
    var form = `
    Log In
    <form action='/loggingIn' method='get'>
        <input name='email' type='text' placeholder='email'>
        <p>\n</p>
        <input name='pwd' type='text' placeholder='password'>
        <p>\n</p>
        <button>Submit</button>
    </form>`
    res.send(form);
    
})

app.get('/members',(req,res) => {
    //get username from db
    // var name = req.query.username;
    var text = `Hello,memeber`;
     res.send(text);
    
})

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
    
})

app.get('/*',(req,res) => {
   res.send(`Page not found - 404`)
})

app.listen(port, () => {
	console.log("Node application listening on port "+port);
});