import express from 'express';
import usersRouter from './routes/users.router';
import loginRouter from './routes/login.router';
import booksRouter from './routes/books.router';
import commentsRouter from './routes/comments.router';

const app = express();
const port = 3000; // default port to listen
const dotenv = require('dotenv')

dotenv.config()

// middleware used to parse incoming requests with JSON payloads
app.use(express.json())


app.use('/api/users', usersRouter)
app.use('/api/books', booksRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/login', loginRouter)


// swagger configuration
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition: any = {
    openapi: '3.0.0',
    info: {
        title: 'API REST Good Books',
        version: '1.0.0',
        description: 'This is REST API for Good Book library'
    },
    components: {
        securitySchemes: {
            jwt: {
                type: 'http',
                name: 'Authorization',
                scheme: 'bearer',
                in: 'header',
                bearerFormat: 'JWT',
            }
        }
    },

    security: [{
        jwt: []
    }],

    servers: [
        {
            url: `http://localhost:${port}`,
            description: 'Local server'
        }
    ]
};

const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['**/routes/*.js', './routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
const swaggerUi = require('swagger-ui-express');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
})

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
