const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { GraphQLError } = require('graphql')


//relative imports
const User = require('../../models/user/user.model');
const { validateInputReg, validateInputLogin } = require('../../utils/validators');
const verifyToken = require('../../utils/checkAuth');



const userResolvers = {
    Mutation: {
        register: async (_, { registerInput: { username, email, password, confirmPassword }}, context, info) => {
            // user validation
            try {
                const { errors, valid } = validateInputReg(username, email, password, confirmPassword);
                if(!valid) {
                    throw new GraphQLError("Errors", {errors: errors,});
                }
                //validate user
                const user = await User.findOne({ email });
                if(user) {
                    throw new GraphQLError("User already exists");
                }
                password = await bcrypt.hash(password, 12);
                const newUser = new User({ username, password, email  });
                await newUser.save();
                // const token = jwt.sign({
                //      id: savedUser._id,
                //     username: savedUser.username,
                //     email: savedUser.email,
                // }, "secret", { expiresIn: "2h"} );
    
                return "User created successfully..."
            } catch (error) {
                throw new GraphQLError(error)
            }
        
        },

        //login mutation
    login: async (_, { email, password }) => {
        // validate the input fields
        const { errors, valid } = validateInputLogin(email, password);
        if(!valid) {
            throw new GraphQLError("Errors", { errors })
        }
        // fetch the user from the database
        const user = await User.findOne({ email })
        if(user) {
            // validate the passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                throw new GraphQLError("Incorrect password")
            } else {
                const token = jwt.sign({
                    id: user._id,
                    username: user.username,
                    email: user.email,
               }, "secret", { expiresIn: "24h"} );

               return {
                ...user._doc,
                id: user._id,
                token: token
               }
            }
        } else {
            throw new GraphQLError('User not found')
        }
        
    },
    followUser: async (_, { userId }, context) => {
        const { id } = verifyToken(context);
        try {
            if (!id) {
                throw new Error('Unauthorized access. User not authenticated.');
            }
    
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found.');
            }
    
            const currentUser = await User.findById(id);
            if (!currentUser) {
                throw new Error('Current user not found.');
            }
    
            const isFollowing = currentUser.followers.some((follower) => follower.userId === user.id);
    
            if (isFollowing) {
                // If already following, unfollow the user
                currentUser.followers = currentUser.followers.filter((follower) => follower.userId !== user.id);
            } else {
                // If not already following, follow the user
                currentUser.followers.push({
                    userId: user.id,
                    createdAt: new Date().toISOString(),
                });
            }
    
            await currentUser.save();
            const followed = currentUser.followers.find(f => f.userId === userId)
            return followed;
        } catch (error) {
            // Log the error for debugging purposes
            console.error('An error occurred while handling follow/unfollow action:', error);
            throw new Error('Could not handle follow/unfollow action. Please try again later.');
        }
    }
    
    }
}


module.exports = userResolvers