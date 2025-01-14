const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "Aidan182004";

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: "Username already exists" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await prisma.user.findUnique({
      where: { id },
      include: { watchlist: true },
    });

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.post("/watchlist", async (req, res) => {
  const { movieId, title, posterUrl } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const movie = await prisma.movie.create({
      data: {
        id: movieId,
        title,
        posterUrl,
        userId: id,
      },
    });

    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: "Failed to add movie to watchlist" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
