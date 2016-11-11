var cpufiles = null;
var diskfiles = null;
var mydata = null;
var path = require("path");
var fs = require("fs");
var http = require("http");
var express = require("express");
var childProcess = require("child_process");
var process = require("process");
var walk = require("walk");
var prepend = require("prepend-file");
var app = express();
var mydirs = [];

app.use(express.static(__dirname + ''));

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/procfs', function (req, res) {
    childProcess.exec('cat /proc/diskstats > disk.txt', (error, stdout, stderr) => {
        if (error) {
            console.log(error);
        } else {
            console.log(stdout);
        }
    });

    var diskStatsHeaderString = "\n" + "DISK STATS:" + "\n";

    childProcess.exec('cat /proc/cpuinfo > cpuFile.txt', (error, stdout, stderr) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log(stdout);
        }
    });

    var cpuHeaderString = "\n" + "CPU INFOMATION:" + "\n";

    fs.unlinkSync("new.txt");

    fs.readFile("disk.txt", function (err, data) {
        diskfiles = data;
        console.log(diskfiles);
    });

    fs.readFile("cpuFile.txt", function (err, data) {
        cpufiles = data;
        console.log(files);
    });

    fs.appendFileSync("new.txt", cpuHeaderString, "utf8");
    fs.appendFileSync("new.txt", cpufiles, "utf8");
    fs.appendFileSync("new.txt", diskStatsHeaderString, "utf8");
    fs.appendFileSync("new.txt", diskfiles, "utf8");

    fs.readFile("new.txt", function (err, data1) {
        res.send(data1);
    });
});

app.get('/files', function (req, res) {
    //     console.log('displaying files');
    //     res.send(files);
    var walker = walk.walk('/home/Uma', { followLinks: false });

    walker.on('file', function (root, stat, next) {
        mydirs.push(root + '/' + stat.name);
        next();
    });

    walker.on('end', function () {
        console.log(mydirs);
    });

    var allfiles = JSON.stringify(mydirs);
    allfiles = JSON.parse(allfiles);
    res.send(allfiles);
});

var cmd = "ls > filelist.txt";

childProcess.exec(cmd, (error, stdout, stderr) => {
    if (error) {
        console.log(error);
    } else {
        console.log(stdout);
    }
});

fs.readFile("filelist.txt", "utf8", function (err, data) {
    files = data;
    console.log('read files');
});

//404 error
app.use(function (req, res, next) {
    res.send(404, "file not found");
});

//start server
app.listen(8000);
console.log("listening on port 8000");

