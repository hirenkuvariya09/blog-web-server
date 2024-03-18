const mongoose = require("mongoose");

// Connect to MongoDB database
const connect = mongoose.connect("mongodb+srv://admin:123@demo.70cmnt4.mongodb.net/login-ai?retryWrites=true&w=majority");

connect.then(() => {
    console.log("Database connected successfully");
}).catch(() => {
    console.log("Database connection failed");
});

// Define the Login schema
const LoginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Define the Blog schema
const BlogSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
    // You can add more fields as needed
});

const EmployeeSchema = new mongoose.Schema(
    {
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
 })




 const feedbackSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});



// Create models based on the schemas
const collection = mongoose.model("User", LoginSchema);
const Blog = mongoose.model("Blog", BlogSchema);
const EmployeeModel = mongoose.model("employees", EmployeeSchema);
const Feedback = mongoose.model("Feedback", feedbackSchema);
// Export the models
module.exports = {
    collection,
    Blog,
    EmployeeModel,
    Feedback
};
