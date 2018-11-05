const passport=require('passport');
const googleStrategy=require('passport-google-oauth2');
const keys=require('./keys');
const User=require('../models/user-model');
const FacebookStrategy=require('passport-facebook');

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
            //add user to mongoDB
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
);

passport.use(new FacebookStrategy({
    clientID: keys.facebook.FACEBOOK_APP_ID,
    clientSecret: keys.facebook.FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/redirect',
    profileFields: ['id', 'email', 'gender', 'displayName','photos','link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
  },(accessToken,refreshToken,profile,done)=>{
    //check if user exists in mongoDB
    User.findOne({facebookID:profile.id}).then((currentUser)=>{
        if(currentUser){
            //already existing
            console.log("User logged in is : "+currentUser);
            done(null,currentUser);
        }
        else{
            //add user to mongoDB
            new User({
                username:profile.displayName,
                facebookID:profile.id,
                thumbnail:profile._json.picture.data.url
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
);
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));
