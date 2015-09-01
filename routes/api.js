var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Post = mongoose.model('Post');
var Address = mongoose.model('Address');
//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('/#login');
};

// uncomment to use only authenticated
router.use('/addr', isAuthenticated);

router.route('/addr')

	.get(function(req, res) {
		console.log('debug addr1');
		Address.find(function(err, addresses){
			console.log('debug addr2');
			if(err){
				return res.status(500).send(err);
			}
			return res.status(200).send(addresses);
		});
	})

	.post(function(req, res) {
		var addr = new Address();
		addr.ipAddress = req.body.ipAddress;
		addr.created_by = req.body.created_by;
		addr.desc = req.body.desc;
		addr.created_at = req.body.created_at;
		addr.save(function(err, address) {
			if (err){
				return res.status(500).send(err);
			}
			return res.json(address);
		});
	});

router.route('/addr/:id')
	//gets specified address
	.get(function(req, res){
		Address.findById(req.params.id, function(err, addr){
			if(err)
				res.send(err);
			res.json(addr);
		});
	})
	//updates specified address
	.put(function(req, res){
		Address.findById(req.params.id, function(err, addr){
			if(err)
				res.send(err);

			addr.ipAddress = req.body.ipAddress;
			addr.created_by = req.body.created_by;
			addr.desc = req.body.desc;

			addr.save(function(err, addr){
				if(err)
					res.send(err);

				res.json(addr);
			});
		});
	})
	//deletes the address
	.delete(function(req, res) {
		Address.remove({
			_id: req.params.id
		}, function(err) {
			if (err)
				res.send(err);
			res.json("deleted :(");
		});
	});

//Register the authentication middleware
router.use('/posts', isAuthenticated);

router.route('/posts')
	//creates a new post
	.post(function(req, res){

		var post = new Post();
		post.text = req.body.text;
		post.created_by = req.body.created_by;
		post.save(function(err, post) {
			if (err){
				return res.status(500).send(err);
			}
			return res.json(post);
		});
	})
	//gets all posts
	.get(function(req, res){
		console.log('debug1');
		Post.find(function(err, posts){
			console.log('debug2');
			if(err){
				return res.status(500).send(err);
			}
			return res.status(200).send(posts);
		});
	});

//post-specific commands. likely won't be used
router.route('/posts/:id')
	//gets specified post
	.get(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);
			res.json(post);
		});
	})
	//updates specified post
	.put(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);

			post.created_by = req.body.created_by;
			post.text = req.body.text;

			post.save(function(err, post){
				if(err)
					res.send(err);

				res.json(post);
			});
		});
	})
	//deletes the post
	.delete(function(req, res) {
		Post.remove({
			_id: req.params.id
		}, function(err) {
			if (err)
				res.send(err);
			res.json("deleted :(");
		});
	});

module.exports = router;
