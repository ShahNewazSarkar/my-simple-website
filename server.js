const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const port = 3055;
app.use((req, res, next) => {
    console.log(`New request from ${req.ip} to ${req.method} ${req.url}`);
    next();
});
app.get("/", (req, res) => {
    res.send("Hello, world! Express is working.");
});
server.on("connection", (socket) => {
    console.log("New TCP connection established:", socket.remoteAddress);
});
server.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});

