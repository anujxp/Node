import mongoose from "mongoose";
import validator from "validator"; // Pro tip: Use this library for easy email validation

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true // Makes lookups by username super fast
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            validate: [validator.isEmail, "Please enter a valid email address"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"] // Basic security
        },
        role: {
            type: String,
            enum: {
                values: ['user', 'artist'],
                message: '{VALUE} is not a valid role' // Better error handling
            },
            default: 'user'
        }
    },
    { 
        timestamps: true // Crucial: Tracks creation and update times automatically
    }
);



// Convention: Use PascalCase for the model name ("User")
export const User = mongoose.model("User", userSchema);