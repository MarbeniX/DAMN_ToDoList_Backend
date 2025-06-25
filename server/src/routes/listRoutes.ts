import { Router } from "express";
import { ProjectController } from "../controllers/ListController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import { TaskController } from "../controllers/TaskController";
import { validateListExists } from "../middlewares/list";
import { validateTaskExists } from "../middlewares/tasks";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate )

router.post("/",
    body("listName").notEmpty().withMessage("Name is required"),
    body("listName").isLength({ max: 20 }).withMessage("Name must be less than 20 characters"),
    body("listName").isLength({ min: 1 }).withMessage("Name must be at least 1 character"),
    body("description").isLength({ max: 100 }).withMessage("Description must be less than 100 characters"),
    handleInputErrors,
    ProjectController.createList
);

router.get("/",
    ProjectController.getAllLists
)

router.get("/category/:category",
    param("category").notEmpty().withMessage("Category is required"),
    handleInputErrors,
    ProjectController.getAllListsByCategory
)

router.get("/:id",
    param("id").isMongoId().withMessage("Invalid ID"),
    handleInputErrors,
    ProjectController.getListById
)

router.patch("/:id",
    param("id").isMongoId().withMessage("Invalid ID"),
    body("listName").notEmpty().withMessage("Name is required"),
    body("listName").isLength({ max: 20 }).withMessage("Name must be less than 20 characters"),
    body("listName").isLength({ min: 1 }).withMessage("Name must be at least 1 character"),
    body("description").isLength({ max: 100 }).withMessage("Description must be less than 100 characters"),
    handleInputErrors,
    ProjectController.updateList
)

router.delete("/:id",
    param("id").isMongoId().withMessage("Invalid ID"),
    handleInputErrors,
    ProjectController.deleteList
)

//Routes for tasks
router.param('listId', validateListExists)
router.param('taskId', validateTaskExists)

router.post("/:listId/tasks",
    param("listId").isMongoId().withMessage("Invalid ID"),
    body("description").notEmpty().withMessage("Description is required"),
    body("description").isLength({ max: 100 }).withMessage("Description must be less than 100 characters"),
    handleInputErrors,
    TaskController.createTask
)

router.get("/:listId/getTasks",
    param("listId").isMongoId().withMessage("Invalid ID"),
    handleInputErrors,
    TaskController.getAllTasksByList
)

router.get("/:listId/tasks",
    param("listId").isMongoId().withMessage("Invalid ID"),
    handleInputErrors,
    TaskController.getAllTasks
)

router.get("/:listId/tasks/:taskId",
    param("listId").isMongoId().withMessage("Invalid ID"),
    param("taskId").isMongoId().withMessage("Invalid ID"),
    handleInputErrors,
    TaskController.getTaskById
)

router.patch("/:listId/tasks/:taskId",
    param("listId").isMongoId().withMessage("Invalid ID"),
    param("taskId").isMongoId().withMessage("Invalid ID"),
    body("description").isLength({ max: 100 }).withMessage("Description must be less than 100 characters"),
    handleInputErrors,
    TaskController.updateTask
)

router.delete("/:listId/tasks/:taskId",
    param("listId").isMongoId().withMessage("Invalid ID"),
    param("taskId").isMongoId().withMessage("Invalid ID"),
    handleInputErrors,
    TaskController.deleteTask
)

router.patch("/:listId/tasks/:taskId/completed",
    param("listId").isMongoId().withMessage("Invalid ID"),
    param("taskId").isMongoId().withMessage("Invalid ID"),
    handleInputErrors,
    TaskController.setCompletedTask
)

router.patch("/:listId/tasks/:taskId/favorite",
    param("listId").isMongoId().withMessage("Invalid ID"),
    param("taskId").isMongoId().withMessage("Invalid ID"),
    handleInputErrors,
    TaskController.setFavoriteTask
)

export default router;