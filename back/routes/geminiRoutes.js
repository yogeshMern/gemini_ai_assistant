const express = require("express");
const {
  generateText,
  generateImage,
} = require("../controllers/geminiController");

const router = express.Router();

router.post("/text", generateText);
router.post("/image", generateImage);

module.exports = router;
