import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import medicamentRoutes from "./modules/medicament/routes/medicament.route";
import authRoutes from "./modules/auth/routes/auth.routes";
import pharmacieRoutes from "./modules/pharmacie/routes/pharmacie.routes";
import stockRoutes from "./modules/stock/routes/stock.routes";
import commandeRoutes from "./modules/commande/routes/commande.routes";
import paymentRoutes from "./routes/payment.routes";
import statsRoutes from "./routes/stats.routes";
import aiRoutes from "./routes/ai.routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/medicaments", medicamentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pharmacies", pharmacieRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/commandes", commandeRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/ai", aiRoutes);

export default app;
