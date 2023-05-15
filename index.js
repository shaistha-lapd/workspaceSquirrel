import express from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const HOST = 'localhost'
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs")
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json()); 
app.use(express.static("public"));
  
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "PublicSafetyResourceDataBase",
});


con.connect(function (err) {
  if (err) {
    console.log("Error in Connection");
  } else {
    console.log("Connected");
  }
});

app.get('/', (req,res)=>{
  res.render('index', {title : "Enter your SQL Query Here!"})
})

app.get('/squirrels', (req,res)=>{
  let query = "select * from squirrels INNER JOIN squirrel_teams ON squirrels.squirrel_ID = squirrel_teams.team_ID";
  con.query(query, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return res.json(result);
  })});

app.get('/squirrels/add', (req,res) => {
  res.render('add', {title : 'squirell Database', description : 'add'})
  let query = '';
  let response;
  con.query(query, (err, result) => {
    if(err) return res.json({Error: 'Error in running query'});
    response = json(result);
    return 0;
  })
})



  
 

app.post('/result', (req,res)=>{
  const reqQuery = req.body.query;
  con.query(reqQuery, (err, result) => {
    if (err) return res.json({ Error: "Error in runnig query" });
    return res.json(result);
  });
})

app.listen(port, () => console.log(`Server Running at ${HOST}:${port}`));
 
