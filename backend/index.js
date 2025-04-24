require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const { Collaboration } = require("./model/collaborationModel");
const { User } = require("./model/user");
const Review = require("./model/review");
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const http = require("http");
const { Server } = require("socket.io");
const ChatMessage = require("./model/chat"); // Chat model
const path = require("path");

const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized. Please log in." });
};

// Routes
app.get("/isAuthenticated", (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated(), user: req.user });
});

const nodemailer = require("nodemailer");
require("dotenv").config();

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(409).json({ error: "Username already exists" });

    const newUser = new User({ username, email });
    await User.register(newUser, password); // from passport-local-mongoose

    // ✅ Email Setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to EcoBridge! 🌍",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2>Hi ${username},</h2>
          <p>Thanks for signing up for <strong>EcoBridge</strong> – your hub for sustainable collaboration and impact!</p>
          
          <h3>🚀 Get Started:</h3>
          <ul>
            <li>🔍 Explore ongoing collaborations aligned with the UN SDGs</li>
            <li>📝 Create or join impactful sustainability projects</li>
            <li>💬 Chat with teammates and share ideas in real time</li>
            <li>📊 Track your project’s <strong>Green Score</strong> and see your collective impact</li>
          </ul>
    
          <p>We’re here to support your journey every step of the way. Let’s build a greener, more sustainable future together! 🌱</p>
    
          <p>If you have any questions, feel free to reply to this email or contact our support team at <a href="mailto:support@ecobridge.org">support@ecobridge.org</a>.</p>
    
          <br/>
          <p>Warm regards,</p>
          <p><strong>The EcoBridge Team</strong></p>
          <hr/>
          <p style="font-size: 12px; color: #777;">You're receiving this email because you signed up on EcoBridge.</p>
        </div>
      `
    };
    
    // ✅ Send the email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);

    res.status(201).json({ message: "User registered successfully and email sent" });
  } catch (err) {
    console.error("Signup or email error:", err);
    res.status(500).json({ error: "Signup failed: " + err.message });
  }
});


app.post("/login", passport.authenticate("local", { failureFlash: true }), (req, res) => {
  res.status(200).json({ message: "Login successful" });
});

app.post("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout failed', error: err });
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Successfully logged out' });
  });
});

// Collaboration routes
app.get("/collabs", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const availableCollabs = await Collaboration.find({ members: { $ne: userId } })
      .populate("members", "username")
      .populate("createdBy", "username");
    res.json(availableCollabs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch collaborations" });
  }
});

app.get("/user/collabs", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const userCollabs = await Collaboration.find({ members: userId })
      .populate("members", "username")
      .populate("createdBy", "username");
    res.json(userCollabs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user collaborations" });
  }
});

app.get("/user/collabs/:id", isAuthenticated, async (req, res) => {
  try {
    const collab = await Collaboration.findById(req.params.id)
      .populate("members", "username")  // Ensure members have usernames populated
      .populate("createdBy", "username");
    if (!collab) return res.status(404).json({ error: "Collaboration not found" });
    res.json(collab);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch collaboration details" });
  }
});


app.post("/collabs/join/:id", isAuthenticated, async (req, res) => {
  try {
    const collabId = req.params.id;
    const userId = req.user._id;
    const collaboration = await Collaboration.findById(collabId);
    if (!collaboration) return res.status(404).json({ error: "Collaboration not found." });
    if (collaboration.members.includes(userId)) return res.status(400).json({ error: "Already a member." });
    collaboration.members.push(userId);
    await collaboration.save();
    res.json({ message: "Successfully joined the collaboration!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to join collaboration." });
  }
});

app.post("/collabs/create", isAuthenticated, async (req, res) => {
  try {
    const { title, description, sdgs, members } = req.body;
    const creatorId = req.user._id;
    const usersToAdd = await User.find({ username: { $in: members || [] } });
    const allMemberIds = [...new Set([creatorId, ...usersToAdd.map(u => u._id)])];
    const newCollab = new Collaboration({ title, description, sdgs, createdBy: creatorId, members: allMemberIds });
    await newCollab.save();
    res.status(201).json(newCollab);
  } catch (err) {
    res.status(500).json({ error: "Failed to create collaboration" });
  }
});

// Socket.io
io.on("connection", (socket) => {
  console.log("🔌 New socket connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`📦 Socket ${socket.id} joined room ${roomId}`);

    // Fetch chat history for the room and send it to the user
    ChatMessage.find({ collaborationId: roomId })
      .sort({ createdAt: 1 })
      .populate("sender", "username") // Populate sender with username
      .then(history => {
        socket.emit("chatHistory", history);
      })
      .catch(err => {
        console.error("Error fetching chat history:", err);
      });
  });

  socket.on("chatMessage", async ({ roomId, content, sender }) => {
    try {
      // Create new chat message with sender's ObjectId
      const newMessage = new ChatMessage({
        sender: sender._id,  // Store sender as ObjectId
        content,
        collaborationId: roomId
      });
      await newMessage.save();

      // Emit new chat message to room
      io.to(roomId).emit("chatMessage", newMessage);
    } catch (err) {
      console.error("Error saving chat message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("✅ MongoDB connected successfully.");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
});

app.get('/reviews/:collaborationId', isAuthenticated, async (req, res) => {
  try {
    const reviews = await Review.find({ collaborationId: req.params.collaborationId })
      .populate('userId', 'username') // Ensure userId is populated correctly
      .sort({ createdAt: -1 });

    if (!reviews) return res.status(404).json({ error: 'No reviews found for this collaboration' });

    res.send(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.post("/reviews", isAuthenticated, async (req, res) => {
  const { collaborationId, userId, rating, review } = req.body;

  if (!collaborationId || !userId || !rating || !review) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newReview = new Review({
      collaborationId,
      userId,
      rating,
      review,
      createdAt: new Date(),
    });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error('Review save failed:', err);
    res.status(500).json({ error: "Failed to save review" });
  }
});

app.delete('/reviews/:reviewId', isAuthenticated, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (!review.userId.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
    }

    // Use `findByIdAndDelete` to delete the review
    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ message: 'Review deleted successfully', review });
  } catch (err) {
    console.error('Failed to delete review:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});
