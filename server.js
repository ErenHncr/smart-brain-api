const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');
const signout = require('./controllers/signout');
const profilImage = require('./controllers/profilImage');

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

const app = express();
app.use(fileUpload());

app.use(morgan("combined"))
app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res) => { res.send("db.users") })
app.post('/signin', signin.signinAuthentication(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) })
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) })
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) })
app.post('/signout', signout.revokeAuth);
app.post('/upload/:id', (req, res) => { profilImage.uploadImageToS3(req, res) });
app.get('/getUrl/:id', (req, res) => { profilImage.getImageFromS3(req, res) });
app.listen(3000, () => {
  console.log('app is running on port 3000');
})
