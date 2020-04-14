const bodyParser = require('body-parser')
var cors = require('cors')
const brain = require('brain.js');
var mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;
var schemas = require('./mongoSchema');
const request = require('request');
var Countries = schemas.Countries;
var Users = schemas.User;
var Place = schemas.Place;

app.use(cors())

app.use(
  bodyParser.urlencoded({
    extended: true
  })
)




app.use(bodyParser.json())
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCW4b9s7kSCjsGCwOcQ3pza0AvMXgsf-V0'
});
// const Client = require("@googlemaps/google-maps-services-js").Client;

//////////////////////////////////////////////////////////////////////////////////////////////////////

// googleMapsClient.geocode({
//   address: '1600 Amphitheatre Parkway, Mountain View, CA'
// }, function(err, response) {
//   if (!err) {
//     console.log(response.json.results);
//   }
// });


app.post('/login', (req, res) => {
Users.findOne({ UserName: req.body.UserName, Password: req.body.Password}, function (err, user) {
  if (user==undefined) {
    console.log("user not found");
    
    res.send(false)
  }
else{
  console.log("user found");
res.send(true);
  }
});

});



//////////////////////////////////////
app.post('/register', (req, res) => {
  var newUser = new Users({ "UserName": req.body.UserName, "Password": req.body.Password, "firstName": req.body.firstName, "lastname": req.body.lastname});
    newUser.save(newUser, function (err, newUser) {
      if (err) return handleError(err);
      console.log("saveNewUser");
      res.send(true);
    });
  });

  app.post('/saveTrip', (req, res) => {
    // console.log(req.body.trip);
    console.log(req.body.tripName);
      var arr=[];
      req.body.trip.forEach(element => {
        // console.log(element.geometry.location.lat);
        // "lat":element.geometry.location.lat,"lng":element.element.geometry.location.lng
        // let x=element.geometry.location.lat;
        // let y=
        
        
        var newPlace = new Place({ "place_id": element.place_id,"lat":element.geometry.location.lat,"lng":element.geometry.location.lng,"name": req.body.tripName});
        arr.push(newPlace);
      });
      // console.log(arr);
      // console.log(req.body.username);
      var person=Users.updateOne({"UserName":req.body.username},{$push: {Places:arr}},function(err,raw){
      // console.log(raw);
      res.send(true);
      });
    });
    
  







  app.get('/getPlaceDetails', (req, res) => {
    console.log("getPlaceDetails");
    console.log(req.query.placeId);
    
    let url=`https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.query.placeId}&key=AIzaSyCW4b9s7kSCjsGCwOcQ3pza0AvMXgsf-V0`;
    // console.log("getphotoreference");
    
    function getPlaceDetails(){
      return new Promise(function(resolve, reject){
          request(url, function (error, response, body) {
              // in addition to parsing the value, deal with possible errors
              if (error) return reject(error);
              try {
                  // JSON.parse() can throw an exception if not valid JSON
                  resolve(JSON.parse(body));
              } catch(e) {
                  reject(e);
              }
          });
      });
    }
    getPlaceDetails().then(function(val) {
    console.log("val",val);
   res.send(val)
   }).catch(function(err) {
     // console.err(err);
   });
    });
    
    
  


    app.get('/getUserTrips', (req, res) => {
      console.log("getPlaceDetails");
      console.log(req.query.username);
      
      Users.findOne({"UserName":req.query.username},function(err,doc){
        console.log(doc);
        res.send(doc);

      });
      });
      





////////////////////////

app.get('/GetAutoComplete', (req, res) => {
//  let apiKey="AIzaSyBcoXqhPVQPu-07dFLCxDYO-HKfjeqplJc"
console.log(req.query.autoComplete);
 let url=`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.query.autoComplete}&key=AIzaSyCW4b9s7kSCjsGCwOcQ3pza0AvMXgsf-V0`;
 function parse(){
  return new Promise(function(resolve, reject){
      request(url, function (error, response, body) {
          // in addition to parsing the value, deal with possible errors
          if (error) return reject(error);
          try {
              // JSON.parse() can throw an exception if not valid JSON
              resolve(JSON.parse(body));
          } catch(e) {
              reject(e);
          }
      });
  });
}
parse().then(function(val) {
  // console.log("enter to promise");
  let arr=[];
  for (let index = 0; index < val.predictions.length; index++) {
    arr.push(val.predictions[index].description);
  }
  // console.log(arr);
  res.send(arr);
}).catch(function(err) {
  // console.err(err);
});
});


app.get('/GetNearbyPlacesDetails', (req, res) => {
  console.log(req.query.place);
  console.log(req.query.activities);

  // let url=`https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+tel-aviv&key=AIzaSyBcoXqhPVQPu-07dFLCxDYO-HKfjeqplJc`;
  let url=`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${req.query.activities}+in+${req.query.place}&key=AIzaSyCW4b9s7kSCjsGCwOcQ3pza0AvMXgsf-V0`;
  function parseNearbyPlacesDetails(){
   return new Promise(function(resolve, reject){
       request(url, function (error, response, body) {
           // in addition to parsing the value, deal with possible errors
           if (error) return reject(error);
           try {
               // JSON.parse() can throw an exception if not valid JSON
               resolve(JSON.parse(body));
           } catch(e) {
               reject(e);
           }
       });
   });
 }
 parseNearbyPlacesDetails().then(function(val) {
/// console.log(val['results']);
res.send(val['results'])
}).catch(function(err) {
  // console.err(err);
});
});


// app.get('/Getphotoreference', (req, res) => {
//   console.log(req.query.photoreference);
// let photoreference=req.query.photoreference;
// console.log(photoreference);

//   let url=`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CmRaAAAAmmdVhuR923hpchhfuCnsGBxdpGwJmmxfJ9UXNeAE5o3FtpKj19kRWg8DviRPh3plLrTtGV08p23Wz24YcwpSCxGyTIiMY6z8YUOlR6DvdvC3dLRJymfJj_-tdvgHagiCEhDSk3IHb5IVNOgIBGZCC6TjGhSjwAlSG6CjDJ4RDNxMBJVQBJOEAg&key=AIzaSyBcoXqhPVQPu-07dFLCxDYO-HKfjeqplJc`;
//   function parsephotoreference(){
//    return new Promise(function(resolve, reject){
//        request(url, function (error, response, body) {
//            // in addition to parsing the value, deal with possible errors
//            if (error) return reject(error);
//            try {
//                // JSON.parse() can throw an exception if not valid JSON
//                resolve(JSON.parse(body));
//            } catch(e) {
//                reject(e);
//            }
//        });
//    });
//  }
//  parsephotoreference().then(function(photo1) {
//   console.log("enter to promise2");
// console.log(photo1);
// // res.send(val['results'][0])
// }).catch(function(err) {
//   // console.err(err);
// });




// });

//server runing and listen
app.listen(port, () => console.log(`TravellMe listening on port ${port}!`))