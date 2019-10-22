const admin = require('firebase-admin');
const ServiceAccount = require('./ServiceAccout');
admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount),
    databaseURL: "https://trading-game-v2.firebaseio.com"
});

const db = admin.firestore();

const uid = 'j2GWAW0q5mPHFCXVmQvZiSdx7It1';
const email = 'jorge@jorge.com';
const password = 'oi1234***';
const name = 'John Doe';
admin.auth().createUser({
    email: email,
    password: password,
    displayName: name,
    disabled: false
})
    .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', userRecord.uid);
        console.log(userRecord);
    })
    .catch(function(error) {
        console.log('Error creating new user:', error);
    });