import express from "express"
import { generateController } from "../controller/generateController.js"

const router = express.Router()

router.route("/generate").post(generateController)

export default router 