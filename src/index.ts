import express from "express";
import cors from "cors";
import helmet from "helmet";
import { AppDataSource } from "./data-source";
import { ContactService } from "./services/ContactService";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log("Database connection established");
    })
    .catch((error) => {
        console.error("Error connecting to database:", error);
        process.exit(1);
    });

app.post("/identify", async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;
        const contactService = new ContactService();
        const result = await contactService.identifyContact(email, phoneNumber);
        res.json(result);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 