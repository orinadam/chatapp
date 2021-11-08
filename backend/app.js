const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Db = require("./db");
const cookieParser = require("cookie-parser");
const Chat = require("./models/chat");
const Message = require("./models/message");
const multer = require("multer");
const upload = multer({ dest: "backend/public/static/profile_photos/" });
const path = require("path");
var cors = require('cors')

const app = express();
const db = new Db();

app.use(cors({ origin: "http://localhost:3000", credentials: true, }));
app.use(express.json());
app.use(cookieParser());

app.use("/static", express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  req.db = db;
  next();
});

const maxAge = 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "fkjabcjksIwjbkKVHH72yie2dgJHCV", {
    expiresIn: maxAge,
  });
};

const requireAuth = (req, res, next) => {
  const userToken = req.cookies.jwt;
  if (userToken) {
    jwt.verify(
      userToken,
      "fkjabcjksIwjbkKVHH72yie2dgJHCV",
      (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.json({ method: "login inv" });
        } else {
          console.log(decodedToken);
          req.userId = decodedToken.id;
          next();
        }
      }
    );
  } else {
    res.json({ method: "login" });
  }
};

const handleErrors = (err) => {
  let error = { username: "", password: "" };
  console.log(err);
};

app.get("/", requireAuth, (req, res) => {
  res.json({ user: req.userId });
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.json({ success: { user: user._id } });
  } catch (err) {
    if (err.code && err.code === 11000) res.status(400).json({ error: "User already exists" });
    res.status(400).send({ error: "An error occured" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.json({ success: { user: user._id } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/chat", requireAuth, async (req, res) => {
  const { getterUsername } = req.body;
  const getterUser = await User.findOne({ username: getterUsername });
  if (getterUser) {
    const chat = await Chat.create({
      members: [req.userId, getterUser._id],
      messgaes: [],
    });
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Failed to create a new chat" });
  }
});

app.get("/chats", requireAuth, async (req, res) => {
  const chats = await Chat.find({ members: req.userId }).populate("members");
  const filteredChats = chats.map((chat) => {
    const user = chat.members.filter((member) => member._id != req.userId)[0];
    return {
      id: chat._id,
      user: { id: user._id, username: user.username },
    };
  });
  res.json({ success: filteredChats });
});

app.get("/chats/:id", requireAuth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate("members")
      .populate("messages");
    const user = chat.members.filter((member) => member._id != req.userId)[0];
    res.json({ success: { id: chat._id, username: user.username, messages: chat.messages } });
  } catch (e) {
    res.status(400).json({ error: "No such chat" });
  }
});

app.post("/chats/:id/messages", requireAuth, async (req, res) => {
  if (req.body.text && req.body.text !== "") {
    const message = new Message({
      sender: req.userId,
      text: req.body.text,
      date: new Date(),
      seen: false,
    });
    const chat = await Chat.findById(req.params.id);
    chat.messages.push(message);
    chat.save();
    message.save();
    res.send(message);
  } else {
    res.send("cant send empty message");
  }
});

app.delete("/chats/:id/messages/:messageId", requireAuth, async (req, res) => {
  const { id, messageId } = req.params;
  const chat = await Chat.findByIdAndUpdate(id, {
    $pull: { messages: messageId },
  });
  const message = await Message.findByIdAndDelete(messageId);
  if (!chat) {
    res.send("no such chat");
  } else if (!message) {
    res.send("no such message");
  } else {
    res.send("worked");
  }
});

app.get("/chats/search", requireAuth, async (req, res) => {
  const chats = await Chat.find({ members: req.userId }).populate("members");
  const filteredChats = chats.map((chat) => {
    const user = chat.members.filter((member) => member._id != req.userId)[0];
    return {
      id: chat._id,
      user: { id: user._id, username: user.username },
    };
  });
  const searchedChats = filteredChats.filter(
    (chat) => req.query.name && chat.user.username.includes(req.query.name)
  );
  res.send(searchedChats);
});

app.delete("/chats/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.send("Successfully deleted!");
});

app.post(
  "/profilephoto",
  requireAuth,
  upload.single("avatar"),
  async (req, res) => {
    await User.findByIdAndUpdate(req.userId, {
      profilePhoto: req.file.filename,
    });
    res.send("Profile picture uploaded");
  }
);

app.listen(5000, () => {
  console.log("Listening");
});
