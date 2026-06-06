import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import medicamentRoutes from "./modules/medicament/routes/medicament.route";
import authRoutes from "./modules/auth/routes/auth.routes";
import pharmacieRoutes from "./modules/pharmacie/routes/pharmacie.routes";
import stockRoutes from "./modules/stock/routes/stock.routes";
import commandeRoutes from "./modules/commande/routes/commande.routes";
import paymentRoutes from "./routes/payment.routes";
import statsRoutes from "./routes/stats.routes";
import aiRoutes from "./routes/ai.routes";

const app = express();

// Configure CORS explicitly so preflight (OPTIONS) requests are handled
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
	origin: (origin, cb) => {
		if (!origin) return cb(null, true); // allow server-to-server or same-origin requests
		if (allowedOrigins.length === 0) return cb(null, true); // allow all if not configured
		cb(null, allowedOrigins.includes(origin));
	},
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
}));

// Ensure OPTIONS preflight returns 204 (no redirect)
// Handle OPTIONS preflight with a simple middleware to avoid path-to-regexp issues
app.use((req, res, next) => {
	if (req.method === 'OPTIONS') {
		// eslint-disable-next-line no-console
		console.log('[CORS] Handling preflight for', req.path);
		return res.sendStatus(204);
	}
	next();
});
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

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
