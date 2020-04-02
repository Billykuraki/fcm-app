
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    admin = require("firebase-admin"),
    serviceAccount = require("server_account.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "YOUR_FIREBASE_URL"
})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


const token = 'REGISTER_TOKEN'

var topic = 'weather'


app.get('/message', (req, res) => {
    res.render('message.ejs')
})

app.post('/message', (req, res) => {

    var title = req.body.title
    var message = req.body.message
    var image = req.body.image
    var pushMessage = {
        notification: {
            title: title,
            body: message
        },

        android: {
            ttl: 3600 * 1000,
            notification: {
              icon: 'stock_ticker_update',
              color: '#f45342',
            },
        },
        token : token
    }

    console.log(`title: ${title}, message: ${message}`)

    admin.messaging().send(pushMessage).then((response) => {
        console.log('Successfully sent message:', response);
    }).catch((err) => {
        console.log('Error sending message: ' + err)
    })

    res.redirect('/message');
})

app.listen(8080, () => {
    console.log('fcm app has started on port 8080');
});