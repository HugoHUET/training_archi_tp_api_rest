import { Router } from 'express';
import { UnknownUserError } from '../errors/unknown-user.error';
import { UsersService } from '../services/users.service';

const loginRouter = Router();

const usersService = new UsersService();

/**
 * @openapi
 * /login:
 *   get:
 *     summary: Log into the app
 */
loginRouter.post('/', (request, response) => {
    try {
        const user = usersService.login(request.body.email, request.body.password)
        response.send(user)
    } catch (error) {
        if (error instanceof UnknownUserError) {
            response.status(401)
        } else {
            response.status(400)
        }
        response.send(error.message)
    }
})

export default loginRouter;