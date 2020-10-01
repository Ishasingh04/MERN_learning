const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    company:{
        type:String
    },
    website:{
        type: String
    },
    location:{
        type: String
    },
    status:{
        type: String,
        required: [true, 'Status is required!'],
    },
    skills:{
        type: [String],
        required: required: [true, 'Skills are required!'],
    },
    bio:{
        type: String
    },
    githubusername:{
        type: String
    },
    experience: [
        {
            title: {
                type: String,
                required: required: [true, 'Title is required'],
            },
            company:{
                type:String,
                required: required: [true, 'Company name is required'],
            },
            location:{
                type:String
            },
            from:{
                type: Date,
                required: required: [true, 'From field is required'],
            },
            to:{
                type: Date
            },
            current:{
                type: Boolean,
                dafault: false
            },
            description:{
                type: String
            }
        }
    ],
    education:[
        {
            school: {
                type: String,
                required: required: [true, 'School field is required'],
            },
            degree:{
                type: String,
                required: required: [true, 'Degree field is required'],
            },
            current: {
                typr: Boolean,
                default: false
            },
            description:{
                type: String
            }
        }
    ],
    social: {
        youtube:{
            type: String
        },
        twitter:{
            type: String
        },
        facebook:{
            type: String
        },
        linkedin: {
            type: String
        },
        instagram:{
            type: String
        }
    },
    date:{
        type: Date,
        default: Date.now
    }

});

module.exports = Profile = mongoose.model('profile', ProfileSchema);