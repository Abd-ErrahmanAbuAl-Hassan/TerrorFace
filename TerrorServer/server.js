// server.js
const jsonServer = require('json-server');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Path to your db.json
const middlewares = jsonServer.defaults();

// Allow CORS from your GitHub Pages UI
server.use(cors({
  origin: 'https://abd-errahmanabual-hassan.github.io',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Default middlewares
server.use(middlewares);

// JSON Server routes
server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
