import { Router } from "express";
import { register, login } from "./user.controller.js";
import userValidation from "./user.validation.js";
import validate from "../../middleware/validation.middleware.js";

const router = Router();

router.post('/user', validate(userValidation.register), register)
router.post('/user/login', validate(userValidation.login), login)

export default router;