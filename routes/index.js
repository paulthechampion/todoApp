const express = require('express');
const app = express();
const csurf = require("csurf")
const passport = require('passport')
const Todo = require("../module/todo")


app.get('/',isLoggedIn,async(req,res)=>{
    const message= req.flash('noSave')
    res.render("index",{
        message:message,
        hasErrors :message.length>0
    })
         
})

app.post("/",async(req,res)=>{

    let newTodo = new Todo({
      user : req.user,
      subject: req.body.subject,
      objective: req.body.objective,
      dateDue: new Date(req.body.dateDue).toISOString().split('T')[0]
    })
 try{ 
    await newTodo.save()
    req.flash("noSave","Your task has been saved, make another one!!")
    res.redirect("/")
}catch{
    req.flash("noSave","Couldn't save todo, try again")
    res.redirect("/")
}
})


app.get('/todo',isLoggedIn,async(req,res)=>{
    const message = req.flash("complete")
    const todos = await Todo.find({user:req.user})
   try{
    res.render("todo",
    {
        todos:todos,
        message:message,
        hasErrors :message.length>0
    })
   }catch{
    res.redirect("/")
   }
         
})

app.delete('/todo/:id',isLoggedIn,async(req,res)=>{
    let todo

    try{
        todo= await Todo.findById(req.params.id)
        await todo.remove()
        req.flash("complete", "Task Completed!")
        res.redirect("/todo")
    }catch{
        if(todo!=null){
            req.flash("complete", "Todo did not remove, try again")
            res.redirect("/todo")
        }
    }
})




const csrfProtection = csurf();
app.use(csrfProtection)




app.get('/todo',isLoggedIn,async(req,res)=>{
    try{
       
        }catch{

        }
         
    
})
app.get('/logout',isLoggedIn,async(req,res)=>{
   try{
    await req.logout();
    res.redirect('/signin')
    }
    catch{
        res.redirect("/")
    }
})

app.use('/',notLoggedIn,(req,res,next)=>{
    next();
})

app.get('/signup', (req,res)=>{
    req.logout();
    const message= req.flash('error')
    res.render('user/signup',
        {csrfToken: req.csrfToken(),
        message:message,
        hasErrors :message.length>0
    })
    
    });

app.post("/signup", passport.authenticate('local-signup',{
    failureRedirect:'/signup',
    failureFlash: true
}),(req,res)=>{
    res.redirect("/")
})

app.get('/signin', (req,res)=>{
    req.logout();
    const message= req.flash('error')
    res.render('user/signin',
        {csrfToken: req.csrfToken(),
        message:message,
        hasErrors :message.length>0
    })  
})

app.post("/signin",passport.authenticate("local-signin",{
    failureRedirect:'/signin',
    failureFlash: true
}),(req,res)=>{
    res.redirect("/")
})




function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/signin')
}

function notLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        return next()
    }
    res.redirect('/')
}

module.exports= app;