import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";

const router = Router();

router.post("/create-account",
    body("email").isEmail().withMessage("Invalid email"),
    body("username").notEmpty().withMessage("Username is required"),
    body("username").isLength({ max: 12 }).withMessage("Username must be less than 12 characters"),
    body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
    body("password").notEmpty().withMessage("Password is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 6 characters"),
    body("passwordMatch").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),
    handleInputErrors,
    AuthController.createAccount
)

router.post("/confirm-account",
    body("token").notEmpty().withMessage("Token is required"),
    body("token").isLength({ min: 6 }).withMessage("Token must be at least 6 characters"),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post("/login",
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 6 characters"),
    handleInputErrors,
    AuthController.login
)

router.post("/request-code",
    body("email").isEmail().withMessage("Invalid email"),
    handleInputErrors,
    AuthController.requestCode
)

router.post("/send-reqpass-code",
    body("email").isEmail().withMessage("Invalid email"),
    handleInputErrors,
    AuthController.requestPasswordReset
)

router.post("/validate-token",
    body("token").notEmpty().withMessage("Code is required"),
    body("token").isLength({ min: 6 }).withMessage("Code must be at least 6 characters"),
    handleInputErrors,
    AuthController.validateToken
)

router.post("/update-password/:token",
    body("password").notEmpty().withMessage("Password is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 6 characters"),
    body("passwordMatch").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),
    handleInputErrors,
    AuthController.resetPassword
)


export default router;