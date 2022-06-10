const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}));


app.get('/get_wallets', function(req, res){
    
    mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, (err, client) => {
        
      if (err) {
        console.error(err);
        return
      }
      const db = client.db('securitize_db');
      const collectionWallets = db.collection('wallets');

      try{

        db.collection("wallets").find().toArray(function(err, result) {
            if (err){

            }else{
                res.send(result);
            }
         
        });
        
       }catch(e){
        console.log(e);
        }
      
    });

});


app.post('/save_wallet', function(req, res){
    
    var wallet = req.body[0].Wallet;
    var balance = req.body[0].Balance;

    mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, (err, client) => {
        
      if (err) {
        console.error(err);
        return
      }
      const db = client.db('securitize_db');
      const collectionWallets = db.collection('wallets');

      try{
        //Add wallet if it doen't exist
        collectionWallets.updateOne({account : wallet},{$set: {wallet:wallet,balance:balance}},{ upsert: true }, (err, result) => {
    
            if(err){
              console.log(err);
              res.end();
            }else{
              res.send(true);
            }

        });
        
        }catch(e){
        console.log(e);
        }
      
    });

});

http.listen(8000, function(){
      console.log('listening on *:8000...');
  
      
});