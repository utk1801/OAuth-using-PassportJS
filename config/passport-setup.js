const passport=require('passport');
const googleStrategy=require('passport-google-oauth2');
const keys=require('./keys');
const User=require('../models/user-model');

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    });
});

passport.use(
    new googleStrategy({
        //options for Google Strategy
        callbackURL:'/auth/google/redirect',
        clientID:keys.google.clientID,
        clientSecret:keys.google.clientSecret
},(accessToken,refreshToken,profile,done)=>{
    //check if user exists in mongoDB
    User.findOne({googleID:profile.id}).then((currentUser)=>{
        if(currentUser){
            //already existing
            console.log("User logged in is : "+currentUser);
            done(null,currentUser);
        }
        else{
            new User({
                username:profile.displayName,
                googleID:profile.id,
                thumbnail:profile._json.image.url
            }).save().then((newUser)=>{
                console.log("New User created"+newUser);
                done(null,newUser);
            });
        }
    });
    //passport Callback func
    console.log('passport callback fired');
    console.log(profile);
 
})
)