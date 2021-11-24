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
var Chatter = require('./Chatter');
var cors = require('cors')


const app = express();

var expressWs = require('express-ws')(app);

const db = new Db();
const chatters = new Map;

app.use(cors({ origin: "http://localhost:3000", credentials: true, }));
app.use(express.json());
app.use(cookieParser());

app.use("/static", express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use((req, res, next) => {
  req.chatters = chatters;
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

app.ws("/", (ws, req) => {
  ws.on("message", (message) => {
    const parsed = JSON.parse(message);
    // {op: "IDENTIFY", d: {token: "!@$12124124124"}}
    switch (parsed.op) {
      case "IDENTIFY":
        // token valid?
        // {op: "ERROR", d: {message: "Invalid creds"}}
        // send this ^
        jwt.verify(
          parsed.d.token,
          "fkjabcjksIwjbkKVHH72yie2dgJHCV",
          (err, decodedToken) => {
            if (err) {
              console.log(err.message);
            } else {
              const chatter = new Chatter(ws, decodedToken);
              console.log("-------", decodedToken, "--------")
              chatters.set(decodedToken.id, chatter);
            }
          }
        );
        break;
      // if is valid ->
      // extract the data the token
    }
  });
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

    res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });
    res.json({ success: { user: { username: user.username, profilePhoto: user.profilePhoto, id: user.id } } });
  
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/chat", requireAuth, async (req, res) => {
  const { getterUsername } = req.body;
  const getterUser = await User.findOne({ username: getterUsername });

  if (getterUser && getterUser._id != req.userId) {
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
  let lastMessageContent = ""
  const chats = await Chat.find({ members: req.userId }).populate("members").populate("messages");
  const filteredChats = chats.map((chat) => {
    const user = chat.members.filter((member) => member._id != req.userId)[0];
    if (chat.messages && chat.messages.length) {
      const lastMessage = chat.messages[chat.messages.length - 1];
      lastMessageContent = `${lastMessage.sender == req.userId ? "You: " : ""}${lastMessage.text}`;
    }
    return {
      id: chat._id,
      user: { id: user._id, username: user.username, photo: user.profilePhoto, lastMessage: lastMessageContent },
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
    console.log(req.userId);
    console.log(req.chatters.size)
    console.log(chat.members)
    console.log(chat.members.find(s => s._id !== req.userId))
    const chatter = req.chatters.get(String(chat.members.find(s => String(s._id) !== req.userId)));
    if (chatter) {
      chatter.connection.send(JSON.stringify({
        op: "MESSAGE_CREATE",
        d: {
          message: message
        }
      }));
    }

    // new Map;
    // req.connectedSockets.get(chat.members.find(s => s.id !== req.userId));
    // if (_) {
    //  _.send({
    //    {op: "MESSAGE_CREATE", d: {content: ""}} 
    // }) 
    // }

    /**
     * 
     * 
     * on message:
     *   switch (_.op) {
     *      case "MESSAGE_CREATE":
     *        ...
     *   }
     * 
     */
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
