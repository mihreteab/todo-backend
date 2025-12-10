import { Router } from "express";
import Validate from "../../middleware/validation.middleware.js";
import {index, store } from "./todo.controller.js";
import { create as createValidation } from "./todo.validation.js";  
import Authenticated from "../../middleware/authenticated.middleware.js";

const router = Router();

router.get("/todo", Authenticated, index);
router.post("/todo", Validate(createValidation), store);

export default router;