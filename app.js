const Express = require('express');
const Mongoose = require('mongoose');
const request = require('request');
const bodyParser = require('body-parser');

var app = new Express();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// For CORS,Pgm Line no 12 to 29
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200' );
    //res.setHeader('Access-Control-Allow-Origin', '"http://customapi-jossin.herokuapp.com"' );

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

//Mongoose.connect('mongodb://localhost:27017/CustomDB');
Mongoose.connect('mongodb+srv://jossin:jossin@cluster0-arjkd.mongodb.net/test?retryWrites=true&w=majority'); //mongodb cloudatlas add, remener to change password

////////////////////////////////////////////////
//define dataschema fro sign-up data in S:\CausalityBiomodels\ABCD\ICT\HW\HW26082019_1_LogInForm\ProjectLogIn
const formSchema = Mongoose.model('formdetails',
{
    sname:String,
    saddr:String,
    sgender:String,
    sdstrct:String,
    sbday:String,
    smob:String,
    smail:String,
    spass:String,
    scpass:String
}
);

const studentSchema = Mongoose.model('studentdetails',{
    uname:String,
    uroll:String,
    uadmn:String,
    udob:String,
    umail:String,
    ubrnch:String,
    ucolg:String
})


//define save API upon save button
app.get('/saveInfo/',(req,res)=>{
    //var details = req.body;
    var person = new formSchema({'sname':req.query.sname, 'saddr':req.query.saddr, 'sgender':req.query.sgender, 'sdstrct':req.query.sdstrct, 'sbday':req.query.sbday, 'smob':req.query.smob, 'smail':req.query.smail, 'spass':req.query.spass, 'scpass':req.query.scpass});
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

// ////define retrievel API
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
//const retrieveDataApi = "http://localhost:3052/retrieveInfo"
const retrieveDataApi = "https://customapi-jossin.herokuapp.com/retrieveInfo"

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
// /////////////////////////////////////////////////////
// //define the API to get a singleperson

// app.get('/searchByMobAPI/',(req,res)=>{
//     var prsnmob = req.query.q;
//     formSchema.find({umob:prsnmob}, (error, data)=>{
//         if(error){
//             throw error;
//         }else{
//             res.send(data);
//         }
//     });
// });

// //define API link
// const searchByNameAPILink = 'http://localhost:3052/searchByMobAPI'
// //const searchByNameAPILink = "https://persondb-jossin.herokuapp.com/searchByMobAPI"

// //use in function to retrieve data
// app.post('/searchPerson',(req,res)=>{
//     item = req.body.smob;
//     request(searchByNameAPILink+"/?q="+ item, (error, response, body)=>{
//         if(error){
//             throw error;
//         }else{
//             var data = JSON.parse(body);
//             res.send(data);
//         } 
//     });
// });
///////////////////////////////////
//APIs for Student Schema
//insert student into databse
app.post('/insertStudent',(req,res)=>{
    var student = new studentSchema(req.body);
    student.save((error,data)=>{
        if(error){
            throw error;
        }else {
            //console.log(data);
            res.send(data);
        }
    })
})



//retrieve a single student from databse using admn no.
app.post('/retrieveStudentByAdmn',(req,res)=>{
    var admn = req.body.sadmn;
    studentSchema.find({uadmn:admn},(error,data)=>{
        if(error){
            throw error;
        }else {
            //console.log(data);
            res.send(data);
        }
    })
})
//view all student records in database
app.get('/viewStudents',(req,res)=>{
    studentSchema.find((error,data)=>{
        if(error){
            throw error;
        }else{
            res.send(data);
        }
    })
})
// update student
app.post('/updateStudent',(req,res)=>{
    var student = req.body;
    var id = req.body._id;
    studentSchema.update({_id:id},{$set:{uname:student.uname,
        uroll:student.uroll,
        uadmn:student.uadmn,
        udob:student.udob,
        umail:student.umail,
        ubrnch:student.ubrnch,
        ucolg:student.ucolg
    }},(error,data)=>{
        if(error){
            throw error;
            res.send (error);
        }else{
            res.send('<script>alert("Entry updated!")</script>');
            console.log(data);
        }
    });
    });

//deleteAPI
app.post('/deleteStudent',(req,res)=>{
    var id = req.body._id;
    studentSchema.remove({_id:id}, (error, data)=>{
        if(error){
            throw error;
        }else{
            res.send(data);
        }
})
})




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
})
