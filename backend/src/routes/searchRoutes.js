const express = require("express");

const {
    searchDesigners,
} = require("../controllers/searchController");

const router = express.Router();

router.get(
    "/designers",
    searchDesigners
);

module.exports = router;