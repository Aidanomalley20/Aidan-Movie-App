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
  const { username, password, firstName, lastName, email, phoneNumber } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email,
        phoneNumber,
      },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json(error.message);
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
    });

    if (user) {
      res.json({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error in /me endpoint:", error);
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
    const { id: userId } = jwt.verify(token, SECRET_KEY);

    const movie = await prisma.movie.create({
      data: {
        id: parseInt(movieId, 10),
        title,
        posterUrl,
        userId,
      },
    });

    res.status(201).json(movie);
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    res.status(400).json({ error: "Failed to add movie to watchlist" });
  }
});

app.delete("/watchlist/:movieId", async (req, res) => {
  const { movieId } = req.params;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { id: userId } = jwt.verify(token, SECRET_KEY);

    const result = await prisma.movie.deleteMany({
      where: {
        id: parseInt(movieId, 10),
        userId,
      },
    });

    if (result.count > 0) {
      res.status(200).json({ message: "Movie removed from watchlist" });
    } else {
      res.status(404).json({ error: "Movie not found in watchlist" });
    }
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    res.status(500).json({ error: "Failed to remove movie from watchlist" });
  }
});

app.get("/watchlist", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { id: userId } = jwt.verify(token, SECRET_KEY);
    const watchlist = await prisma.movie.findMany({
      where: { userId },
    });

    res.json(watchlist);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
