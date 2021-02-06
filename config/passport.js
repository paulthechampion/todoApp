const passport = require("passport")
const User = require('../module/user')
const LocalStrategy = require("passport-local").Strategy


passport.serializeUser((user,done)=>{
    done(null, user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user)
    })
})

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    req.checkBody('email', "Invalid email").notEmpty().isEmail()
    req.checkBody('password', "Passowrd is too short, must be more than eight characters").notEmpty().isLength({min:4})
    var errors = req.validationErrors()
    if(errors){
        let message =[]
        errors.forEach((error)=>{
            message.push(error.msg)
        })
        return done(null,false,req.flash("error", message))
    }
    User.findOne({'email':email},(err,user)=>{
        if(err){
            return done(err);
        }
        if(user){
            return done(null,false,{message:"Email is already in use"})
        }
        let newUser = new User();
            newUser.email = email
            newUser.password = newUser.encryptPassword(password)
            newUser.save(function(err,result){
                if(err){
                    return done(err);
                }
                return done(null, newUser)
            }) 
    })
}
))

passport.use("local-signin", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, (req,email,password,done)=>{
    req.checkBody('email', "Invalid email").notEmpty().isEmail()
    req.checkBody('password', "Incorrect Password").notEmpty()
    var errors = req.validationErrors()
    if(errors){
        let message =[]
        errors.forEach((error)=>{
            message.push(error.msg)
        })
        return done(null,false,req.flash("error", message))
    }
    User.findOne({'email':email},(err,user)=>{
        if(err){
            return done(err);
        }
        if(!user){
            return done(null,false,{message:"Email is incorrect"})
        }
        if(!user.validPassword(password)){
            return done(null,false,{message:"Password is incorrect"})
        }
        return done(null,user);
    })
}))