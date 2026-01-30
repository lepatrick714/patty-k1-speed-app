"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const racers_controller_1 = require("../controllers/racers.controller");
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => racers_controller_1.racersController.getAllRacers(req, res, next));
router.get('/:name', (req, res, next) => racers_controller_1.racersController.getRacerStats(req, res, next));
exports.default = router;
