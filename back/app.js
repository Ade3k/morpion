const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const ObjectID = mongoose.Types.ObjectId;
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const routeUser = require("./routes/user");
const User = require('./models/user');

const allowedOrigins = [
    'https://ade3k.github.io', // L'URL de votre GitHub Pages
    'http://localhost:4200'
];

// Serveur + WebSocket
const server = http.createServer(app);
const io = socketIo(server, {
  addTrailingSlash: false,
  cors: { // <--- Configuration CORS spécifique à Socket.IO
    origin: allowedOrigins, // Utilisez la même liste d'origines autorisées que pour Express
    methods: ["GET", "POST"], // Les méthodes autorisées pour le handshake Socket.IO (GET, POST sont les plus courantes)
    //credentials: true // Important si vous utilisez des cookies ou des sessions pour l'auth
  }
});

// Middleware
dotenv.config();
app.use(bodyParser.json());
app.use(cors({
  origin: function (origin, callback) {
    // Permettre les requêtes sans 'origin' (ex: Postman, requêtes du même domaine)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Méthodes HTTP que vous autorisez
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes que vous autorisez
  credentials: true // Si vous utilisez des cookies ou des sessions entre frontend et backend
}));
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

app.set("socketio", io);

// Connexion MongoDB
const mongoDB = `mongodb+srv://${process.env.PWD_USER}:${process.env.PWD_BD}@cluster0.katm4if.mongodb.net/${process.env.NAME_BD}?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

// Routes API REST
app.get("/", (req, res) => {
  res.send(`Hello World! ---- request time ${req.requestTime}`);
});
app.use("/user/", routeUser);

// WebSocket logique
const usersInRooms = {}; // { roomId: [user1, user2] }

io.on("connection", (socket) => {
  console.log("New client connected");

  // Un client rejoint une room avec son ID utilisateur
  socket.on("joinRoom", async ({ roomId, userId }) => {
    try {
      console.log(`Client ${socket.id} rejoint la room ${roomId} avec l'utilisateur ${userId}`);
      const user = await User.findOne({_id: ObjectID(userId)})
      if (!user) {
        console.error("Utilisateur non trouvé");
        return;
      }
      console.log('userconnected : ', user)

      socket.join(roomId);

      if (!usersInRooms[roomId]) {
        usersInRooms[roomId] = [];
      }

      usersInRooms[roomId].push({
        socketId: socket.id,
        _id: user._id,
        username: user.username,
        avatar: user.avatar || null, // si tu veux aussi afficher l'avatar
      });

      // Quand deux joueurs sont présents dans la room, on les envoie aux clients
      if (usersInRooms[roomId].length === 2) {
        io.to(roomId).emit("playersInfo", usersInRooms[roomId]);
      }
    } catch (error) {
      console.error("Erreur dans joinRoom:", error);
    }
  });

  // Message de chat
  socket.on("chat message", ({ username, roomname, msg }) => {
    io.emit(roomname, `${username} on ${roomname}: ${msg}`);
  });

  socket.on("game progress", ({ userId, roomId, abs, ord, cross }) => {
    console.log(`Game progress from ${userId} in room ${roomId}: abs=${abs}, ord=${ord}, cross=${cross}`);
    io.to(roomId).emit("play", {
      userId,
      abs,
      ord,
      cross,
    }); 
  });

  socket.on('initGame', (username) => {
    console.log(username);
  });

  // Redémarrage du jeu
  socket.on("restartGame", () => {
    socket.broadcast.emit("restartGame");
  });

  // Déconnexion du joueur
  socket.on("disconnect", () => {
    console.log("Client disconnected");

    for (const roomId in usersInRooms) {
      usersInRooms[roomId] = usersInRooms[roomId].filter(
        (u) => u.socketId !== socket.id
      );

      // Optionnel : on peut aussi notifier l’autre joueur que son adversaire a quitté
      if (usersInRooms[roomId].length === 1) {
        io.to(roomId).emit("waitingForOpponent");
      }
    }
  });

  // Enregistrement de la partie quand elle est terminée
  socket.on("gameFinished", async ({ roomId, winner, duration, userId }) => {
    try {
      const users = usersInRooms[roomId];
      if (!users || users.length === 0) return;

      /*const gameData = {
        roomId,
        players: users.map((u) => u._id),
        winner,
        duration,
        playedAt: new Date(),
      };*/

      //await Game.create(gameData);

      socket.broadcast.emit("gameFinished", { roomId, winner, duration, userId });
      console.log(`✅ Partie enregistrée : ${roomId} | Gagnant : ${winner} ${userId}`);
    } catch (err) {
      console.error("❌ Erreur lors de l’enregistrement de la partie :", err);
    }
  });
});

// Fonction pour récupérer l’utilisateur dans MongoDB
async function getUserById(id) {
  console.log(`Recherche de l'utilisateur avec ID : ${id}`);
  return await db.collection("users").findOne({ _id: new ObjectId(id) });
}

// Lancer le serveur en local
server.listen(port, () => {
  console.log(`Application exemple à l'écoute sur le port ${port}!`);
});
// Lancer le serveur sur vercel (not working)
//module.exports = server;
