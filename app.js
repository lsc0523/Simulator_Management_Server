// load environment variables from a .env file into process.env
require('dotenv').config()

/** @constant
 *  @default
    @description Node.js module declaration.
*/
const express = require('express')    
    , morgan = require('morgan')
    , cookieparser = require('cookie-parser')
    , session = require('express-session')
    , errorhandler = require('therror-connect')
    , http = require('http')
    , https = require('https')
    , path = require('path')
    , fs = require('fs')
    , bodyparser = require('body-parser')
    , cors = require('cors')
    , ejs = require('ejs')
    , dateFormat = require('dateformat')
    , config = require('./node_app/config')
    , apis = require('./node_app/routes/apis')
    , excel = require('exceljs');
    
       
const pages = require('./node_app/routes/pages');

/**
 * @constant
 * @description related with app settings. port, views, view engine, session, etc.
 */
const app = express();

const sessionMiddleware = session({
    key: 'key_lgcns_session',
    secret: 'lgcns_rnd',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1 * 60 * 60 * 1000, // 세션 유효 1시간
        secure: process.env.NODE_ENV === 'production' // production인경우만 https
    },
});


// port => process.env.PORT || config.http_port
app.set('port', process.env.PORT)
    .set('views', __dirname + '/views')
    .set('view engine', 'ejs')
    .set('trust proxy', true)
    .use(cors())
    .use(morgan('dev'))
    .use(bodyparser.urlencoded({ extended: true }))
    .use(bodyparser.json({ limit: '50mb' }))
    .use(express.static(path.join(__dirname, 'public')))
    .use('/upload', express.static(path.join(__dirname, 'upload')))
    .use(sessionMiddleware);
    
app.use('/', require('./node_app/routes/main'));
app.use('/api', apis);

app.use('/page', pages);

app.use(express.static("image"));


// error response handler
app.use(function (err, req, res, next) {
    if (err && err.error) {
        console.error(err.error)
    } else {
        console.error(err)
    }

    if (err.code) {
        res.status(err.code)
            .send({
                code: err.code,
                msg: err.msg
            })
    } else {
        res.status(500)
            .send({ 
                code: 500,
                msg: 'unknown server error'
            })
    }
    next();
});


// If want to use own HTTPS SSL cert on this server
const options = {
    key: fs.readFileSync('./node_app/ssl_cert/ssl_key.pem'),
    cert: fs.readFileSync('./node_app/ssl_cert/ssl_cert.pem')
};

// const server = https.createServer(options, app); // For https
const server = http.createServer(app);  // For http

// make default upload directories

if (!fs.existsSync(process.env.PATH_PG_UPLOAD)) {
    fs.mkdirSync(process.env.PATH_PG_UPLOAD)
}

if (!fs.existsSync(path.join(process.env.PATH_PG_UPLOAD, process.env.PATH_SIMULATOR_REMOTE))) {
    fs.mkdirSync(path.join(process.env.PATH_PG_UPLOAD, process.env.PATH_SIMULATOR_REMOTE))
}

server.listen(app.get('port'), function () {
    console.log('"ar remote assistance application" is running at port ' + app.get('port'));
});


