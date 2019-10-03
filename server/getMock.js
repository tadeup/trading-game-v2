const admin = require('firebase-admin');
const ServiceAccount = require('./ServiceAccout');
admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount),
    databaseURL: "https://trading-game-v2.firebaseio.com"
});

const db = admin.firestore();

let docRef = db.collection('test');

let setAda = docRef.add({
    first: 'sdfg',
    last: 'sdfgdsf',
    born: 1814445
}).then(el=>{console.log('jorge: ' + el)});

db.collection('test').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });