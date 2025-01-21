const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
   name:String,
   email:{
      type:String,
      unique:true
   },
   password:String,
   profilePic: {
      url:{
         type: String,
         default: ""
      },
      public_id:{
         type: String,
         default: ""
      }
   }
})

const UserModel = mongoose.model('user',userSchema);
module.exports = UserModel;