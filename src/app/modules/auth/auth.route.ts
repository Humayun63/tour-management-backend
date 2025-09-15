import { Router } from "express";
import { AuthController } from "./auth.controller";
const router = Router();

router.post('/login', AuthController.credentialsLogin);
router.get('/access-token', AuthController.getAccessToken);


export const AuthRoutes = router;
