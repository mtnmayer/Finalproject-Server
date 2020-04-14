var mongoose = require('mongoose');

//connect to mongo
mongoose.connect('mongodb://localhost:27017/TravelMeDataBase', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("connect to mongo")});


// var CommentsSchema = new mongoose.Schema({
//   _id:Number,
//   Title:String,
//   BodyOfTheComment:String,
//   Userid:String,
//   PostId:String,
//   CreateTime:String
// });
// var Comment = mongoose.model('Comment', CommentsSchema);



var commentSchema = new mongoose.Schema({
  Title:String,
  BodyOfTheComment:String,
  Userid:String,
  PostId:String,
  CreateTime:String,
  postRating:Number,
  catgoryName:String,

});
var Comment = mongoose.model('Comment', commentSchema);





var PlaceSchema = new mongoose.Schema({
  formatted_address:String,
  Address:String,
  AvgRating:Number,
  NumOfPost:Number,
  PostIdList:String,
  lat:Number,
  lng:Number,
  id:String,
  name:String,
  place_id:String,
  price_level:String,
  rating:String,
  types:[String],
  lat:String,
  lng:String,

});
var Place = mongoose.model('Place', PlaceSchema);

var PostSchema = new mongoose.Schema({
  Id:Number,
  Title:String,
  BodyOfThePost:String,
  ImageUrl:String,
  ImageName:String,
  Userid:String,
  Place:PlaceSchema,
  Rating:Number,
  CreateTime:String,
  catgoryName:String,
  PlaceName:String
});
var Post = mongoose.model('Post', PostSchema);

var UserSchema = new mongoose.Schema({
  UserName:String,
  Id:String,
  Email:String,
  Password:String,
  firstName:String,
  lastname:String,
  Phone:String,
  Places: [[]],
});
var User = mongoose.model('User', UserSchema);

var CountriesSchema = new mongoose.Schema({
  name:String,
  code:String
});
var Countries = mongoose.model('Countries', CountriesSchema);


var my_schemas = {'User' : User,'Countries':Countries,'Comment':Comment, 'Post': Post,'Place':Place};
module.exports = my_schemas;


