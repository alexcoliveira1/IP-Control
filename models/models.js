var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
	created_by: String,		//should be changed to ObjectId, ref "User"
	created_at: {type: Date, default: Date.now},
	text: String
});

var userSchema = new mongoose.Schema({
	username: String,
	password: String, //hash created from password
	created_at: {type: Date, default: Date.now}
});

var addressSchema = new mongoose.Schema({
	ipAddress: String,
	desc: String,
	created_by: String,
	created_at: {type: Date, default: Date.now}
});


mongoose.model('Post', postSchema);
mongoose.model('User', userSchema);
mongoose.model('Address', addressSchema);
