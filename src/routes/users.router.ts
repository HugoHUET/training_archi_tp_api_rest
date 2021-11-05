import { Router } from 'express';
import { UnknownUserError } from '../errors/unknown-user.error';
import { UsersService } from '../services/users.service';
import { requestLogger} from '../middlewareAuth'
const usersRouter = Router();

const usersService = new UsersService();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserModel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID.
 *           example: 3ffda8e7-06a3-4154-96b6-e39260048200
 *         firstName:
 *           type: string
 *           description: The user's firstname.
 *           example: Leanne
 *         password:
 *           type: string
 *           description: The user's password.
 *           example: changeit
 *         lastName:
 *           type: string
 *           description: The user's lastname.
 *           example: Graham
 *         email:
 *           type: string
 *           description: The user's email.
 *           example: leanne.graham@hotmail.com
 */

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Retrieve a list of all users
 */
usersRouter.get('/', (req, res) => {
    const users = usersService.getAllUsers();
    res.status(200).send(users);
})

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user
 *     description: Retrieve a single user. Can be used to find a user profile.
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: string
 */
 usersRouter.get('/:userID', (req, res) => {
    if (requestLogger(req.headers.authorization)) {
        const user = usersService.getUserById(req.params.userID);
        res.status(200).send(user);
    }else{
        res.status(403)
    }
})


/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserModel'
 */
usersRouter.post('/', (req, res) => {
    try {
        res.status(200).send(usersService.createUser(req.body))
    } catch (error) {
        res.status(400).send(error.message)
    }
})

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Edit a user
 */
usersRouter.put('/:userID', (req, res) => {
    if (requestLogger(req.headers.authorization)) {
        res.status(200).send(usersService.updateUser(req.body));
    } else {
        res.status(400);
    }
})

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 */
usersRouter.delete('/:userID', (req: any, res) => {
    if (requestLogger(req.headers.authorization, "administrator")) {
        res.status(200).send(usersService.deleteUser(req.params.userID, req.user.id))
    }else{
        res.status(400);
    }
})

export default usersRouter;