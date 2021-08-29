const express = require("express");

const { check, validationResult } = require("express-validator");

const gravatar = require("gravatar");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const config = require("config");

const router = express.Router();

const User = require("../../models/User");



// @route  POST api/users

// @desc   user registration route

// @access public

router.post("/", [

	check("name","please enter a name").not().isEmpty(),

	check("email","enter a valid email").isEmail(),

	check("password","min of 6 letters").isLength({min:6})

],async(req,res)=>{

	//validation using express-validator

	const error = validationResult(req);

	if(!error.isEmpty()){

		return res.status(400).json({errors:error.array()});

	}

	// executes only the data is valid

	const {email,name,password} = req.body;

	try {

		// checking for existing user

		let user = await User.findOne({email});

		if(user){

			res.status(400).json({errors:[{msg:"user already exist"}]});

		}

		// avatar from gravatar - s:size, r-ratting, d:default

		const avatar = gravatar.url(email,{

			s:"200",

			r:"pg",

			d:"mm"

		});

		// user instance

		user = new User({

			name,

			email,

			avatar,

			password

		});

		// encrypting password using bcrypt

		const salt = await bcrypt.genSalt(10);        

		user.password = await bcrypt.hash(password, salt);

		// saving the user in user collection after everything

		await user.save();

		// jwt token

		const payload = {

			user: {
				
				id : user.id

			}

		};

		jwt.sign(

			payload,

			config.get("jwtSecret"),

			{ expiresIn: 3600000 },

			( err , token ) => {

				if( err ) {

					console.log ( "server error" );
				}

				res.json( { token } );
			}
		); 



	} catch (error) {

		res.status(400).json({errors:[{msg:error}]});

	}



});



module.exports = router;