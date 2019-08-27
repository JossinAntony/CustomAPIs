const Express = require('express');
const Mongoose = require('mongoose');
const request = require('request');
const bodyParser = require('body-parser');

var app = new Express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

// For CORS,Pgm Line no 12 to 29
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200' );

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

Mongoose.connect('mongodb://localhost:27017/PersonDB');
//Mongoose.connect('mongodb+srv://jossin:jossin@cluster0-arjkd.mongodb.net/test?retryWrites=true&w=majority'); //mongodb cloudatlas add, remener to change password

////////////////////////////////////////////////
//define dataschema
const formSchema = Mongoose.model('formdetails',
{
    uname:String,
    umail:String,
    umob:String,
    umsg:String
}
);

//define save API upon save button
app.get('/saveInfo/',(req,res)=>{
    console.log(req.query.uname);
    //var details = req.body;
    var person = new formSchema({'uname':req.query.uname, 'umob':req.query.umob, 'umsg':req.query.umsg, 'umail':req.query.umail});
    var result = person.save((error, data)=>{
        if (error){
            throw error;
        }else{
            //res.send("<script>alert('New record created!')</script>");
            res.send(data);
            console.log(data);
        }
    });
});

////define retrievel API
app.get('/retrieveInfo',(req,res)=>{
    var retrieve = formSchema.find((error,data)=>{
        if (error){
            throw error;
        }else{
            res.send(data);
        }
        
    });
});

///get link to the retrievel API
const retrieveDataApi = "http://localhost:3046/retrieveInfo"
//const retrieveDataApi = "https://persondb-jossin.herokuapp.com/retrieveInfo"

///call the API in a function to retieve the data
app.get('/viewpersons',(req,res)=>{
    request(retrieveDataApi,(error, response, body)=>{
        if (error){
            throw error;
        }else{
            var data= JSON.parse(body);
            res.send(data);
        }
    });
});
/////////////////////////////////////////////////////
//define the API to get a singleperson

app.get('/searchByMobAPI/',(req,res)=>{
    var prsnmob = req.query.q;
    formSchema.find({umob:prsnmob}, (error, data)=>{
        if(error){
            throw error;
        }else{
            res.send(data);
        }
    });
});

//define API link
const searchByNameAPILink = 'http://localhost:3046/searchByMobAPI'
//const searchByNameAPILink = "https://persondb-jossin.herokuapp.com/searchByMobAPI"

//use in function to retrieve data
app.post('/searchPerson',(req,res)=>{
    item = req.body.smob;
    request(searchByNameAPILink+"/?q="+ item, (error, response, body)=>{
        if(error){
            throw error;
        }else{
            var data = JSON.parse(body);
            res.send(data);
        } 
    });
});


app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/index',(req,res)=>{
    res.render('index');
})

// app.get('/searchperson',(req,res)=>{
//     res.render('searchperson');
// })

app.listen(process.env.PORT || 3052,()=>{
    console.log("Server running at http://localhost:3052")
});
