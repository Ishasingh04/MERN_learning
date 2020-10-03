const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth= require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { json } = require('express');


//@route  GET api/profile/me
//@desc   Get current users profile
//@access Private
router.get('/me',auth, async (req,res) => {
    try{
        const profile = await Profile.findOne({ user : req.user.id}).populate('user', ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for the user'});
        }

        res.json(profile);
        
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@route  Post api/profile
//@desc   create or update user profile
//@access Private
router.post(
    '/',
    [
        auth,
        [
            check('status', 'Sttus is required')
            .not()
            .isEmpty(),
            check('skills', 'Skills is required')
            .not()
            .isEmpty()
        ]
    ],
        async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const{
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        //Buld profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if(website) profileFields.website = website;
        if(location) profileFields.location = location;
        if(bio) profileFields.bio = bio;
        if(status) profileFields.status = status;
        if(githubusername) profileFields.githubusername = githubusername;
        if(skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        // Buld social objects
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;


        //console.log(profileFields.skills);

        try{
            let profile = await Profile.findOne({ user: req.user.id});
            if(profile){
                //Update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id},
                    {$set: profileFields},
                    {new: true }
                );

                 return res.json(profile);
            }

            // Create
            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile);
        }catch(err)
        {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

//@route  GET api/profile
//@desc   Get all profiles profile
//@access Public

router.get('/', async (req, res) => {
    try{
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route  GET api/profile/user/:user_id
//@desc   Get profile by user ID
//@access Public
router.get('/user/:user_id', async (req,res) => {
    try{
        const profile = await Profile.findOne({ user : req.params.user_id}).populate('user', ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({ msg: 'profile not found'});
        }

        res.json(profile);
        
    }catch(err){
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({ msg: ' profile not found'});
        }
        res.status(500).send('Server Error');
    }
});

//@route  DELETE api/profile
//@desc  Delete profile, user & posts
//@access Private

router.delete('/', auth,  async (req, res) => {
    try{
        //@todo - remove users posts
        //Remove profile
        await Profile.findOneAndRemove({user: req.user.id});
        //Remove user
        await User.findOneAndRemove({_id: req.user.id});

        res.json({msg: 'User Deleted'});

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route  PUT api/profile/experience
//@desc  ADD profile experience
//@access Private
router.put('/experience', [auth, [
    check('title','Title is rquired')
    .not()
    .isEmpty(),
    check('company','Company is rquired')
    .not()
    .isEmpty(),
    check('from','From date is rquired')
    .not()
    .isEmpty(),
    ]
],
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array()});
    }
    
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
         title,
         company,
         location,
         from,
         to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user: req.user.id });

        profile.experience.unshift(newExp);
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
});


//@route  DELETE api/profile/experience/:exp_id
//@desc  deleting profile experience
//@access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
        try {
            const profile = await Profile.findOne({user: req.user.id });

            //Get remove index
            const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

    //@route  PUT api/profile/education
//@desc  ADD profile education
//@access Private
router.put('/education', [auth, [
    check('school','School is rquired')
    .not()
    .isEmpty(),
    check('degree','Degree is rquired')
    .not()
    .isEmpty(),
    check('study','Study is rquired')
    .not()
    .isEmpty(),
    check('from','From date is rquired')
    .not()
    .isEmpty(),
    ]
],
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array()});
    }
    
    const {
        school,
        degree,
        study,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        study,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user: req.user.id });

        profile.education.unshift(newEdu);
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
});


//@route  DELETE api/profile/education/:edu_id
//@desc  deleting profile education
//@access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
        try {
            const profile = await Profile.findOne({user: req.user.id });

            //Get remove index
            const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

    //@route  GET api/profile/github/:username
    //@desc  Get user repos from Github
    //@access Public
    router.get('/github/:username', (req,res) =>{
        try {
            const options ={
                uri:encodeURI( `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created.asc`
                ),
                method: 'GET',
                headers: {
                    'user-agent': 'node.js',
                    Authorization: `token ${config.get('githubToken')}`
                }
            };

            request(options,(error,response,body)=>{
                if(error) console.error(error);

                if(response.statusCode != 200){
                   return res.status(404).json({ msg: 'No Github profile found'});
                }
                res.json(JSON.parse(body));
            });
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });



module.exports = router;