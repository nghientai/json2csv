const express = require("express");
const fs = require("fs");
const {Parser} = require("json2csv");

const fields = [
	"id",
	"name",
	"hin",
	"address.addressLine1",
	"address.city",
	"address.state",
	"address.postcode",
	"address.country",
	"address.email1",
	"address.email2",
	"address.phone1",
	"address.phone2",
	{
		label: "fax1",
		value: (row) => row.address.fax1.split("-").join("")
	},
	{
		label: "fax2",
		value: (row) => row.address.fax2.split("-").join("")
	}
];
const json2csvParser = new Parser({fields, quote: ""});

const app = express();
const port = 3000;
const path = "./rx";
const out = fs.createWriteStream("out.csv", {encoding: "utf8"});

app.use(express.static("static"));

app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));

fs.readdir(path, function (err, items) {
	for (var i = 0; i < items.length; i++) {
		var file = path + "/" + items[i];
		fs.stat(file, readFileCallback(file));
	}
});

function readFileCallback(file) {
	return function (err, stats) {
		if (stats["size"] > 2) {
			fs.readFile(file, function (err, data) {
				//console.log(data["size"]);
				//console.log(data !== undefined ? data : "");
				if (data !== undefined) {
					const items = JSON.parse(data);
					const csv = json2csvParser.parse(items);
					out.write(csv + "\n");
					console.log("Writing on this " + file);
				}

				//console.log(csv);
			});
		}
	};
}

app.listen(port, () => console.log(`App listening at port ${port}`));
