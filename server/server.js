import * as http from 'http';
import path from 'path';
import express from 'express';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { joystick } from './joystick.js';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = 3000;
const gameRoute = '/';

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use('/views', express.static('/views'));


app.get(gameRoute, (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});


io.on('connection', socket => {
    console.log('Connected.');
    joystick.on('switch', switchMode => {
        socket.emit('switch', switchMode);
    });
    joystick.on('click', () => {
        socket.emit('click', 1);
    });
    joystick.on('release', () => {
        socket.emit('release', 0);
    })
    joystick.on('move', moveData => {
        socket.emit('move', moveData);
    })
});


server.listen(port, () => {
    console.log('Server started.');
});