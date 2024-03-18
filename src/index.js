
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt')
// const collection = require('./config');
// const Blog = require('./config');
const { collection,EmployeeModel, Blog ,Feedback } = require('./config');
const app = express ();
const cors = require("cors")
//convert data into json file
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// app.use(express.static("public"));
const multer = require('multer');
app.use(express.static("public"));
app.use(cors())

app.userdata
app.set('view engine','ejs');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/'); 
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 } 
}).single('image'); 






app.get("/",(req,res)=>{
    res.render('login');
});


app.get("/signup",(req,res)=>{
    res.render('signup');
});


app.post("/signup",async(req,res)=>{
 const data ={
    username:req.body.username,
    number:req.body.number,
    email:req.body.email,
    password:req.body.password
 }


const isValidNumber = /^\d{10}$/.test(data.number);
if (!isValidNumber) {
    return res.send('Please enter a valid 10-digit phone number.');
}

 
  const existingUser = await collection.findOne({ username: data.username });

  if (existingUser) {
      res.send('User already exists. Please choose a different username.');
  } else {
  
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword; 

    const userdata = await collection.insertMany(data);
    console.log(userdata);
    
}

});
// app.post("/login", async (req, res) => {
//     try {
//         const check = await collection.findOne({ username: req.body.username });
//         if (!check) {
//             res.send("User name cannot found")
//         }
//         const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
//         if (!isPasswordMatch) {
//             res.send("wrong Password");
//         }
//         else {
//             res.render("home");
//         }
//     }
//     catch {
//         res.send("wrong Details");s
//     }
// });

app.post("/login", async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        
        // Check if the usernameOrEmail exists in either username or email field
        const user = await collection.findOne({
            $or: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        });

        if (!user) {
            return res.send("User not found");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.send("Wrong password");
        }

        // If both username/email and password are correct, you can redirect the user or send a success message
        res.render("home");
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.get("/CreateBlog", async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.render('CreateBlog', { blogs });
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/CreateBlog", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error uploading file');
        } else {
            const { title, description, content, image } = req.body;
            const newBlog = new Blog({
                title,
                image, 
                description,
                content
            });

            // console.log(newBlog);
            newBlog.save()
                .then(() => {
                    console.log("Blog post created successfully");
                    res.redirect("/CreateBlog"); 
                })
                .catch(err => {
                    console.error("Error creating blog post:", err);
                    res.status(500).send("Internal Server Error");
                });
        }
    });
});





app.get("/Card", async (req, res) => {
    try {
        // Fetch all the blog data from the database
        const blogs = await Blog.find({});
        // Render the 'cart.ejs' template and pass the blog data to it
        res.render('card', { blogs });
    } catch (error) {
        console.error("Error fetching blog data:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.delete("/deleteBlog/:id", async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).send("Blog post not found");
        }
        res.status(200).send("Blog post deleted successfully");
    } catch (error) {
        console.error("Error deleting blog post:", error);
        res.status(500).send("Internal Server Error");
    }
});



// client side
// Delete Feedback Endpoint
app.delete("/deleteFeedback/:id", async (req, res) => {
    try {
        // Extract ID parameter from request URL
        const feedbackId = req.params.id;

        // Attempt to find and delete feedback by ID
        const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);

        // Check if feedback was found and deleted
        if (!deletedFeedback) {
            // If feedback with the specified ID doesn't exist, send 404 Not Found response
            return res.status(404).send("Feedback not found");
        }

        // Send success response if feedback was deleted successfully
        res.status(200).send("Feedback deleted successfully");
    } catch (error) {
        // Log any errors that occurred during deletion
        console.error("Error deleting feedback:", error);
        // Send internal server error response
        res.status(500).send("Internal Server Error");
    }
}); 




app.post("/signin", (req, res) => {
    const {email, password} = req.body;
    EmployeeModel.findOne({email : email})
    .then(user => {
        if(user) {
            if(user.password === password){
                res.json("Success")
            }else{
                res.json("The password is incorrect")
            }
        }else{
            res.json("No record existed")
        }
    })
})

//backend



app.get('/blogs', async (req, res) => {
    try {
      const blogs = await Blog.find();
      res.json(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.post("/register", (req, res) => {
    EmployeeModel.create(req.body)
    .then(employees => res.json(employees))
    .catch(err => res.json(err))
})


app.post('/FeedbackSubmit', async (req, res) => {
    try {
      // Create a new feedback instance using the submitted data
      const feedback = new Feedback({
        name: req.body.name,
        email: req.body.email,
        contactNo: req.body.contactNo,
        message: req.body.message,
      });
      
      // Save the feedback to the database
      await feedback.save();
  
      // Respond with success message
      res.status(200).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
      // If an error occurs, respond with an error message
      console.error(error);
      res.status(500).json({ message: 'Failed to submit feedback' });
    }
  });


// Route to fetch all feedback records
app.get('/Feedback', async (req, res) => {
    try {
        // Fetch all feedback records from the database
        const feedbackList = await Feedback.find({});
        // Render the 'feedback.ejs' template and pass the feedback data to it
        res.render('feedback', { feedbackList });
    } catch (error) {
        console.error('Error fetching feedback data:', error);
        res.status(500).send("Internal Server Error");
    }
});





const port = 5000 ;
app.listen(port,()=>{
    console.log(`server running on port : ${port}`);
})
