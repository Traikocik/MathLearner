const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());
app.post("/api/generate", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "No prompt transfered" });
        }
        const result = await model.generateContent(prompt);
        res.json({ response: result.response.text() });
    } catch (error) {
        console.error("Error occured during generating content:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.use(express.static(path.join(__dirname, "client")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"));
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});