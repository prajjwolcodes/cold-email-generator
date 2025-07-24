import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { generateController } from "./controller/generateController.js"


dotenv.config()

const app = express()

app.use(
  express.json({
    limit: '5mb',
  })
);
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use("/api", generateController);

app.get("/", (req, res) => {
  res.send("Welcome to Cold email generator");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log("Server running at port", PORT)
})