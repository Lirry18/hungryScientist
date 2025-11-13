import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import session from "express-session";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// USE SESSION TO ENSURE SINGLE VOTING
app.set("trust proxy", 1);

app.use(
  session({
    secret: "rspace_mega_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 6, // AFTER 6 HOURS YOU CAN VOTE AGAIN
    },
  })
);

// DATABASE
const db = new sqlite3.Database("./db.sqlite");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS eateries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    score INTEGER DEFAULT 0
  )`);
});

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hungry Scientist API",
      version: "1.0.0",
      description: "API documentation for the Hungry Scientist Eatery Ranking system",
    },
  },
  apis: ["./server.js"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// ---- ROUTES ----

// GET EATERIES
/**
 * @openapi
 * /eateries:
 *   get:
 *     summary: Get all eateries ranked by score
 *     tags:
 *       - Eateries
 *     responses:
 *       200:
 *         description: A list of eateries
 */
app.get("/eateries", (_, res) => {
  db.all("SELECT * FROM eateries ORDER BY score DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ADD NEW EATERY
/**
 * @openapi
 * /eateries:
 *   post:
 *     summary: Add a new eatery
 *     tags:
 *       - Eateries
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Eatery created
 *       400:
 *         description: Eatery already exists
 */
app.post("/eateries", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });

  db.run(
    "INSERT INTO eateries (name) VALUES (?)",
    [name],
    function (err) {
      if (err)
        return res.status(400).json({ error: "Eatery already exists" });
      res.json({ id: this.lastID, name, score: 0 });
    }
  );
});

// VOTE
/**
 * @openapi
 * /eateries/{id}/vote:
 *   post:
 *     summary: Upvote or downvote an eatery
 *     tags:
 *       - Eateries
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [up, down]
 *     responses:
 *       200:
 *         description: Vote recorded
 *       400:
 *         description: Invalid vote type
 */
app.post("/eateries/:id/vote", (req, res) => {
  const { type } = req.body; // "up" | "down"
  const { id } = req.params;

  // UNCOMMENT LOGS FOR DEBUG

//   console.log("---- VOTE DEBUG ----");
//   console.log("Incoming vote:", type);
//   console.log("Eatery ID:", id);
//   console.log("Session ID:", req.sessionID);
//   console.log("Session votes BEFORE:", req.session.votes);

  const newVote = type === "up" ? 1 : type === "down" ? -1 : 0;
  if (newVote === 0) {
    return res.status(400).json({ error: "Invalid vote type" });
  }

  // Ensure session vote storage exists
  if (!req.session.votes) {
    req.session.votes = {};
  }

  const previousVote = req.session.votes[id] || null;
  let delta = 0;

  if (!previousVote) {
    // new vote
    delta = newVote;

  } else if (previousVote === type) {
    // same vote → no change
    //console.log("Repeat vote → vote unchanged");
    return res.json({ success: true, message: "Vote unchanged" });

  } else {
    // switching vote: reverse old vote & apply new
    const previousValue = previousVote === "up" ? 1 : -1;
    delta = newVote - previousValue;
    //console.log("Switching vote → prev:", previousVote, "new:", type, "delta:", delta);
  }

  // Save new vote in the session
  req.session.votes[id] = type;
  //console.log("Session votes AFTER:", req.session.votes);

  // Apply delta to DB
  db.run(
    "UPDATE eateries SET score = score + ? WHERE id = ?",
    [delta, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});


app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
