import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";

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

// Esquema de usuario con credenciales y rol
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["cliente", "empresa"], required: true },
    age: { type: Number, default: 25 },
    country: { type: String, default: "Global" },
    bio: { type: String, default: "Listo para viajar!" },
    budget: { type: String, enum: ["Bajo", "Medio", "Alto"], default: "Medio" },
    travelStyle: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    avatarUrl: { type: String, default: "https://picsum.photos/seed/me/400/400" },
    destination: { type: String, required: true },
    dates: { type: String, default: "Próximamente" },
    language: { type: String, enum: ["es", "en"], default: "es" },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    // Mapear _id -> id y limpiar campos internos
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

// Registro
app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      age,
      country,
      bio,
      budget,
      travelStyle,
      interests,
      avatarUrl,
      destination,
      dates,
      language,
    } = req.body;

    if (!name || !email || !password || !role || !destination) {
      return res
        .status(400)
        .json({ error: "Nombre, email, contraseña, rol y destino son obligatorios." });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido." });
    }

    if (!["cliente", "empresa"].includes(role)) {
      return res.status(400).json({ error: "Rol inválido." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 6 caracteres." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "El email ya está registrado." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      age,
      country,
      bio,
      budget,
      travelStyle,
      interests,
      avatarUrl,
      destination,
      dates,
      language,
    });

    res.status(201).json(user.toJSON());
  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios." });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    res.json(user.toJSON());
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// Actualizar usuario (incluye idioma)
app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };

    // Nunca permitir actualizar passwordHash directamente
    delete update.passwordHash;

    const user = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user.toJSON());
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API de TravelMatch escuchando en http://localhost:${PORT}`);
});

