var express = require("express");
var bodyParser = require('body-parser');
var multer = require('multer');
var _ = require('underscore');
var fs = require('fs');
var reload = require('require-reload')(require);
const cors = require('cors');

var app = express();
var upload = multer({ storage: multer.memoryStorage() });

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const key = "veerakarthickrfullstackdeveloper";
const branca = require("branca")(key);

var server = app.listen(3000, () => {
	console.log("server is running on port", server.address().port);
});


var userJson = require('./fileSystem/user.json');
var complaintJson = require('./fileSystem/complaints.json');

// API to register a new User/Agent
app.post('/register', function (req, res) {

	var user = _.findWhere(userJson, { userID: req.body.userID.toLowerCase() });

	if (!user) {

		const token = branca.encode(req.body.password);

		var newUser = {
			"userID": req.body.userID.toLowerCase(),
			"password": token,
			"mobile": req.body.mobile,
			"role": req.body.role
		};

		userJson.push(newUser);
		var dataToUpdate = JSON.stringify(userJson);

		fs.writeFile('./fileSystem/user.json', dataToUpdate, (err) => {
			if (err)
				return res.send(err);
			res.send({ "success": "User registration success" });
		});
	}
	else
		res.send({ "error": "UserID already exists, please try with someother userID" });

});


// API to be used for User/Agent to login
app.get('/login', function (req, res) {

	var user = _.findWhere(userJson, { userID: req.query.userID.toLowerCase() });

	if (!user)
		res.send({ "error": "UserID doesn't exists" });
	else {
		var password = branca.decode(user.password);
		password = password.toString();
		if (req.query.password === password && req.query.role === user.role)
			res.send({ "success": "Login success" });
		else if (req.query.password === password && req.query.role !== user.role)
			res.send({ "error": "Please select a correct role" });
		else
			res.send({ "error": "UserID and Password mismatch" });
	}
});


// API to post a complaint by User.
app.post('/complaint', function (req, res) {

	var compSeqJson = reload('./fileSystem/complaintSequence.json');

	var compID = compSeqJson.sequenceNo;
	req.body.complaintID = compID;
	complaintJson.push(req.body);
	var dataToUpdate = JSON.stringify(complaintJson);

	fs.writeFile('./fileSystem/complaints.json', dataToUpdate, (err) => {
		if (err)
			return res.send(err);
		var sequenceToUpdate = JSON.stringify({ "sequenceNo": compID + 1 });
		fs.writeFile('./fileSystem/complaintSequence.json', sequenceToUpdate, (seqErr) => {
			if (seqErr)
				return res.send(seqErr);
			res.send({ "complaintID": compID, "dateCreated": req.body.dateCreated });
		});
	});
});


// API to get all complaints either User/Agent
app.get('/complaints', function (req, res) {
	res.send(_.where(complaintJson, { userID: req.query.userID }));
});


// API to get a complaint either User/Agent
app.get('/complaint/:complaintID', function (req, res) {
	res.send(_.findWhere(complaintJson, { complaintID: parseInt(req.params.complaintID) }));
});

// API to update a complaint by Agent
app.put('/complaint/:complaintID/assign', function (req, res) {
	var complaint = _.findWhere(complaintJson, { complaintID: parseInt(req.params.complaintID) });
	if (complaint) {
		complaint.agentID = req.body.userID;
		complaint.status = "Inprogress";
		var placeHolderArray = _.reject(complaintJson, { "complaintID": complaint.complaintID });
		placeHolderArray.push(complaint);
		fs.writeFile('./fileSystem/complaints.json', JSON.stringify(placeHolderArray), (err) => {
			if (err)
				return res.send(err);
			res.send({ "success": "Complaint assigned successfully" });
		});
	} else
		res.send({ "error": "Complaint not available" });
});


// API to close a complaint by Agent
app.put('/complaint/:complaintID/fix', function (req, res) {
	var complaint = _.findWhere(complaintJson, { complaintID: parseInt(req.params.complaintID) });
	if (complaint) {
		complaint.fixDesc = req.body.fixDesc;
		complaint.status = "Closed";
		var placeHolderArray = _.reject(complaintJson, { "complaintID": complaint.complaintID });
		placeHolderArray.push(complaint);
		fs.writeFile('./fileSystem/complaints.json', JSON.stringify(placeHolderArray), (err) => {
			if (err)
				return res.send(err);
			res.send({ "success": "Complaint closed successfully" });
		});
	} else
		res.send({ "error": "Complaint not available" });
});