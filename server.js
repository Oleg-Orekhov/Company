var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Company = require('./models/Company');
var path  = require("path");
var mongodb;
app.use(bodyParser.json());

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Accept, Content-Type, Authorization, sid");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    next();
})

app.use('/res', express.static(__dirname + '/src'));
app.use('/script', express.static(__dirname + '/node_modules'));

app.get('*', function (request, response){
    //response.sendFile(process.env.PWD, '/src', 'index.html'));
    response.send(process.env.PWD);
});

app.get('/api/company', function(req,res){
    getAllCompanies(res);
});

app.post('/api/company', function(req,res){
    var company = new Company(req.body);
    
    company.save(function(err,result){
        //allEarningsCount();
        //res.status(200).send({success: "success"});
        allEarningsCountPromise(res).then(res => setTimeout(function(){getAllCompanies(res)},3000));
    });
});

app.delete('/api/company', function(req,res){
    console.log(req.body._id);
    Company.remove({_id: req.body._id}).exec(function(err, result){
        if (err){
            //console.log("errr",err);
            //return done(err, null);
        }
        //allEarningsCount();
        //res.status(200).send({success: "success"});
        allEarningsCountPromise(res).then(res => setTimeout(function(){getAllCompanies(res)},3000));
    });
});

app.put('/api/company', function(req,res){
    Company.findOne({_id: req.body._id}).exec(function(err, item){
        if (err) return handleError(err);
        item.name = req.body.name;
        item.earnings = req.body.earnings;
        item.save(function (err, result) {
            //allEarningsCount();
            allEarningsCountPromise(res).then(res => setTimeout(function(){getAllCompanies(res)},3000));
            //res.status(200).send({success: "success"});
        }); 
    });
    
    
});
    

function allEarningsCountPromise(res) {

    return new Promise(function(resolve, reject) {
        Company.find({}).exec(function (err, result) {
            var companies = result;

            //Make allEarnings field for all records equal to zero 
            companies.forEach(function(company){
                company.allEarnings = 0;
            });

            //Count allEarnings
            companies.forEach(function(item){
                if (item.parentId == undefined){
                    countChildEarnings(item, companies);
                }
            });

            companies.forEach(function(company){
                Company.findById(company._id, function (err, item) {
                    if (err) return handleError(err);

                    item.allEarnings = company.allEarnings;

                    item.save(function (err, updatedItem) {
                        if (err) return handleError(err);
                    });
                });
            });
        });
      
        var countChildEarnings = function(company, companies){

            companies.forEach(function(item){
                if ((""+item.parentId) == (""+company._id)){                                
                    countChildEarnings(item, companies);
                }
            });
            company.allEarnings+=company.earnings;
            companies.forEach(function(item){
                if (""+company.parentId == ""+item._id){
                    item.allEarnings+=company.allEarnings;
                }
            })
        }; 
    resolve(res);   
  });
}
    
var allEarningsCount = function(){
    Company.find({}).exec(function (err, result) {
        var companies = result;

        //Make allEarnings field for all records equal to zero 
        companies.forEach(function(company){
            company.allEarnings = 0;
        });
        
        //Count allEarnings
        companies.forEach(function(item){
            if (item.parentId == undefined){
                countChildEarnings(item, companies);
            }
        });
        
        companies.forEach(function(company){
            Company.findById(company._id, function (err, item) {
                if (err) return handleError(err);

                item.allEarnings = company.allEarnings;

                item.save(function (err, updatedItem) {
                    if (err) return handleError(err);
                });
            });
        });
    });
};

//count child earnings method
var countChildEarnings = function(company, companies){
                    
    companies.forEach(function(item){
        if ((""+item.parentId) == (""+company._id)){                                
            countChildEarnings(item, companies);
        }
    });
    company.allEarnings+=company.earnings;
    companies.forEach(function(item){
        if (""+company.parentId == ""+item._id){
            item.allEarnings+=company.allEarnings;
        }
    })
};

var getAllCompanies = function (res){
    Company.find({}).exec(function (err, result) {    
        res.status(200).send(result);
    });
};

mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost:27017/test", function (err, db) {
    if (!err) {
        console.log("we are connected to mongo");
    }
})

var server = app.listen(process.env.PORT || 5000, function () {
    console.log('listening on port ', server.address().port);
})
