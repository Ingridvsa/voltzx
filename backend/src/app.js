import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import terrenoRoutes from "./routes/terrenoRoutes.js";
import projetoRoutes from "./routes/projetoRoutes.js";
import ofertaRoutes from "./routes/ofertaRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/terrenos", terrenoRoutes);
app.use("/api/projetos", projetoRoutes);
app.use("/api/ofertas", ofertaRoutes); 

export default app;
