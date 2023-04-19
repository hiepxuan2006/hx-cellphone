const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
var cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    session({
        secret: 'mysecret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Đặt true nếu sử dụng HTTPS
            maxAge: 1000 * 60 * 60 * 24, // Thời gian sống của cookie (1 ngày)
        },
    }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '/../', 'public')));
setTimeout(async () => {
    await require('./connection/db').connectDB();
    await require('./connection/redisConnection').connectRedis();
    app.use(require('./app.routes'));
    app.get('/', (req, res) => {
        return res.send('hello');
    });
    app.listen(PORT, function () {
        console.log('Server started on PORT ' + PORT);
    });
}, 0);
