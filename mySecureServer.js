var mongoose = require('mongoose'),
express=require("express"),
app=express(),
bodyParser=require("body-parser"),
 User = require('./Secure');

var connStr = 'mongodb://localhost:27017/checkout';// database connection
mongoose.connect(connStr, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});
app.use(bodyParser.urlencoded({extened:false}));
app.use(bodyParser.json());

// create a user a new user
app.get("/",function(req,res){
	res.sendFile("./form.html");
});

app.post("/save",function(req,res){

var testUser = new User({
    username: req.body.name,
    password: req.body.password
});

// save user to database
testUser.save(function(err) {
    if (err) {
		throw err;
	}
	res.send("SuccessFully Saved");

    // attempt to authenticate user
});
});
app.get("/login",function(req,res){
	res.sendFile("./login.html");
});

app.post("/login",function(req,res){
	 User.getAuthenticated(req.body.name,req.body.password, function(err, user, reason) {
        if (err) throw err;

        // login was successful if we have a user
        if (user) {
            // handle login success
            console.log('login success');
            res.send("success");
        }

        // otherwise we can determine why we failed
        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
			res.send("Not Found This User");
			break;
            case reasons.PASSWORD_INCORRECT:
			res.send("Password Incorrect");
                // note: these cases are usually treated the same - don't tell
                // the user *why* the login failed, only that it did
                break;
            case reasons.MAX_ATTEMPTS:
			res.send("Max Attempts tried");
                // send email or otherwise notify user that account is
                // temporarily locked
                break;
        }
    });
	
	
});

app.listen(7070);