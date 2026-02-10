import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB connection (default port 27017)
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/travelmatch";

mongoose
  .connect(MONGODB_URI, {
    dbName: "travelmatch",
  })
  .then(() => {
    console.log("✅ Conectado a MongoDB en el puerto 27017");
  })
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err.message);
  });

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: false }));
app.use(express.json());

// Esquema de usuario (alineado con `types.ts`)
const userProfileSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: String,
    age: Number,
    country: String,
    bio: String,
    budget: { type: String, enum: ["Bajo", "Medio", "Alto"] },
    travelStyle: [String],
    interests: [String],
    avatarUrl: String,
    destination: String,
    dates: String,
  },
  { timestamps: true }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

// Helper: id fijo para el usuario actual
const CURRENT_USER_ID = "user-me";

// Obtener usuario actual
app.get("/api/user/me", async (req, res) => {
  try {
    const user = await UserProfile.findOne({ id: CURRENT_USER_ID }).lean();
    if (!user) {
      return res.status(204).send(); // No Content
    }
    res.json(user);
  } catch (err) {
    console.error("Error al obtener usuario:", err);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

// Crear/actualizar usuario actual
app.put("/api/user/me", async (req, res) => {
  try {
    const payload = { ...req.body, id: CURRENT_USER_ID };

    const user = await UserProfile.findOneAndUpdate(
      { id: CURRENT_USER_ID },
      payload,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    res.json(user);
  } catch (err) {
    console.error("Error al guardar usuario:", err);
    res.status(500).json({ error: "Error al guardar usuario" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API de TravelMatch escuchando en http://localhost:${PORT}`);
});

