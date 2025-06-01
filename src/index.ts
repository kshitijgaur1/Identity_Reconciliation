import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


app.post("/identify", async (req, res) => {
    try {  
        res.json({});
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 