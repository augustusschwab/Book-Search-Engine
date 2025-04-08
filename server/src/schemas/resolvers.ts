import { User } from '../models/index.js';
import { BookDocument } from '../models/Book.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    savedBooks: BookDocument[];
    bookCount: number;
}

interface AddUserArgs {
    input:{
        username: string;
        email: string;
        password: string
    }
}

interface SaveBookArgs {
    input: {
        authors: [string];
        description: string;
        title: string;
        bookId: string;
        image: string;
        link: string;
    } 
}

interface Context {
    user?: User;
}

const resolvers = {
    Query: {
        me: async(_parent: unknown, _args: unknown, context: Context): Promise<User | null> => {
            if(context.user) {
                // If user is authenticated return their profile.
                return await User.findOne({_id: context.user._id})
            }

            // If not authenticated, throw an authentication error.
            throw new AuthenticationError('Not Authenticated');
        },
    },

    Mutation: {
        addUser: async(_parent: unknown, { input }: AddUserArgs) => {
            const user = await User.create({...input});
            const token = signToken(user.username, user.password, user._id);
            
            return { token, user };
        },

        login: async(_parent: unknown, {email, password}: {email: string, password: string}) => {
            //Find a user by email;
            const user = await User.findOne({ email });

            if(!user){
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw){
                throw new AuthenticationError('Not Authenticated');
            }

            // Sign a JWT token for the authenticated profile
            const token = signToken(user.username, user.password, user._id);
            return { token, user };
        },

        saveBook: async(_parent: unknown, { input }: SaveBookArgs, context: Context) => {
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input} },
                    { new: true, runValidators: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in.');
        },

        removeBook: async(_parent: unknown, { bookId }: { bookId: string }, context: Context) => {
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in.')
        }
    },

};

export default resolvers;