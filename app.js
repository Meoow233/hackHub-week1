const fs = require("fs");
const express = require("express")
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const textParser = bodyParser.text();
//const rawParser = bodyParser.raw();

app.listen("8080", (req, res) => {
    console.log("Server started...")
})

app.get("/", (req,res) => {
    res.send('This is the home page');
})

app.get("/:filename", (req, res) => {
    var filename = req.params.filename;
    var path = __dirname+ "/files/" + filename;
    //var path = __dirname + filename;
    fs.readFile(path, (err, data) => {
        if(err) {
            res.send("There is no such file! Please create in advance.");
        } else {
            //console.log(path);
            console.log("Get file " + filename);
            res.json(data.toString());
        }
    })
})

app.post("/:filename", textParser, (req, res) => {
    var filename = req.params.filename;
    var path = __dirname+ "/files/" + filename;
    var content = req.body + "\n";

    if (fs.existsSync(path)) {
        res.send(filename + " has already been created. Please use PUT or DELETE method.");
        return;
    }

    fs.appendFile(path, content, (err) => {
        if (err) throw err;
        console.log("Saved file " + filename);
        console.log(req.body);
    })
    res.send(filename + " saved.")
})

app.put("/:filename", textParser, (req, res) => {
    var filename = req.params.filename;
    var path = __dirname+ "/files/" + filename;
    var content = req.body + "\n";
    if (!fs.existsSync(path)) {
        res.send(filename + " doesn't exist. Please use POST method to create first.");
        return;
    }

    fs.appendFile(path, content, (err) => {
        if (err) throw err;
        console.log("Appended file " + filename);
        console.log(req.body);
    })
    res.send(filename + " appended.")
})

app.delete("/:filename", (req, res) => {
    var filename = req.params.filename;
    var path = __dirname+ "/files/" + filename;

    if (!fs.existsSync(path)) {
        res.send(filename + " doesn't exist.");
        return;
    }

    fs.unlink(path, (err) => {
        if (err) throw err;
    })
    res.send(filename + " deleted.");
})