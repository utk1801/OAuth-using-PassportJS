const router=require('express').Router();

const authCheck=(req,res,next)=>{
    if(!req.user){
        //if user not logged in
        res.redirect('/auth/login');
    }
    else{
        //if logged in already
        next();
    }
};

router.get('/',authCheck,(req,res)=>{
    // res.send('you are now logged in, this is your profile-'+req.user.username);
    res.render('profile',{user:req.user});
});

module.exports=router;