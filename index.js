import express from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
const port = 8000;
const HOST = "localhost";
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

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
app.get("/", (req, res) => {
  res.render("index", { title: "Enter your SQL Query Here!" });
});

app.get("/squirrels", (req, res) => {
  let query =
    "select * from squirrels INNER JOIN squirrel_teams ON squirrels.squirrel_ID = squirrel_teams.team_ID";
  con.query(query, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return res.json(result);
  });
});

app.get("/teams", (req, res) => {
  let query = "SELECT * FROM `squirrel_teams`";
  con.query(query, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return res.json(result);
  });
});

app.get("/squirrels/add", (req, res) => {
  res.render("add", { title: "squirrels Database", description: "add" });
  let query = "";
  let response;
  con.query(query, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    response = json(result);
    return 0;
  });
});

// ${(response.squirrel_ID.length!=0)?`squirrel_ID=${response.squirrel_ID}`:'',

app.post("/DeleteSquirrelData", (req, res) => {
  let response = req.body;
  // let deleteData = response.json()
  let deleteData = response.entryId;
  console.log(response);
  let postQuery = `DELETE from squirrels WHERE squirrel_ID='${deleteData}'`;
  con.query(postQuery, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return 0;
  });
  // console.log(postQuery);
  res.send("OK!");
});

app.post("/DeleteTeamData", (req, res) => {
  let response = req.body;
  let deleteData = response.entryId;
  let postQuery = `DELETE from squirrel_teams WHERE team_ID='${deleteData}'`;
  con.query(postQuery, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return 0;
  });
  res.send("OK!");
});

app.post("/AddSquirrelData", (req, res) => {
  let response = req.body.squirrelFormData;
  console.log(response.squirrel_ID);

  let postQuery =
  `INSERT INTO squirrels (squirrel_ID,update_timestamp,call_handle,latitude,longitude,location_description,user_name,telephone_number,color,icon,user_SID)VALUES 
  ('${response.squirrel_ID}','${response.update_timestamp}','${response.call_handle}','${response.latitude}',
  '${response.longitude}','${response.location_description}','${response.user_name}',
  '${response.telephone_number}','${response.color}','${response.icon}','${response.user_SID}');`;
  con.query(postQuery, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    // response = json(result);
    return 0;
  });
  res.send("OK!");
});

app.post("/AddTeamData", (req, res) => {
  let response = req.body.teamFormData;

  let postQuery = `INSERT INTO squirrel_teams (team_ID,team_name,chat_channel_SID,TeamColor,TeamIcon)VALUES ('${response.team_ID}','${response.team_name}','${response.chat_channel_SID}','${response.color}','${response.icon}');`;
  con.query(postQuery, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    // response = json(result);
    return 0;
  });
  res.send("OK!");
});

app.post("/UpdateSquirrelData", (req, res) => {
  let response = req.body.squirrelFormData;
  let UpdateQuery = `update squirrels set ${
    response.update_timestamp.length != 0
      ? `update_timestamp='${response.update_timestamp}',`
      : ""
  } ${
    response.call_handle.length != 0
      ? `call_handle='${response.call_handle}',`
      : ""
  }${response.latitude.length != 0 ? `latitude='${response.latitude}',` : ""}${
    response.longitude.length != 0 ? `longitude='${response.longitude}',` : ""
  }${
    response.location_description.length != 0
      ? `location_description='${response.location_description}',`
      : ""
  }${
    response.user_name.length != 0 ? `user_name='${response.user_name}',` : ""
  }${
    response.telephone_number.length != 0
      ? `telephone_number='${response.telephone_number}',`
      : ""
  }${response.color.length != 0 ? `color='${response.color}',` : ""}${
    response.icon.length != 0 ? `icon='${response.icon}',` : ""
  }${
    response.user_SID.length != 0 ? `user_SID='${response.user_SID}',` : ""
  }where squirrel_ID= '${response.squirrel_ID}' `;
  var FinalQuery = UpdateQuery.replace(",where", " where");
  con.query(FinalQuery, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return 0;
  });
});

app.post("/UpdateTeamData", (req, res) => {
  let response = req.body.teamFormData;
  let UpdateQuery = `update squirrel_teams set ${
    response.team_name.length != 0 ? `team_name='${response.team_name}',` : ""
  }${
    response.chat_channel_SID.length != 0
      ? `chat_channel_SID='${response.chat_channel_SID}',`
      : ""
  }
  ${response.color.length != 0 ? `TeamColor='${response.color}',` : ""}
  ${
    response.icon.length != 0 ? `TeamIcon='${response.icon}',` : ""
  }where team_ID= '${response.team_ID}' `;
  var FinalQuery = UpdateQuery.replace(",where", " where");
  console.log(FinalQuery);
  con.query(FinalQuery, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return 0;
  });

  res.send("OK!");
});

app.listen(port, () => console.log(`Server Running at ${HOST}:${port}`));
