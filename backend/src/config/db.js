const mongoose = require('mongoose')


const connectionString = process.env.MONGODB_URI
mongoose.connect(connectionString).then((res) => {
	console.log("Server Connected To MongoDB Database!!");
}).catch((err) => {
	console.log(err);
})


