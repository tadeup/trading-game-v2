const functions = require('firebase-functions');
const admin = require('firebase-admin');
const ServiceAccount = require('./trading-game-v2-firebase-adminsdk-v2057-c3dbace971');
admin.initializeApp(ServiceAccount);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.addMessage = functions.https.onCall((data, context) => {
    console.log(data);
    console.log(context);
    return {
        data,
        context
    }
});

exports.addNumbers = functions.https.onCall((data, context) => {
    const firstNumber = data.firstNumber;
    const secondNumber = data.secondNumber;

    if (!Number.isFinite(firstNumber) || !Number.isFinite(secondNumber)) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
            'two arguments "firstNumber" and "secondNumber" which must both be numbers.');
    }

    console.log(context.auth);
    return {
        firstNumber: firstNumber,
        secondNumber: secondNumber,
        operator: '+',
        operationResult: firstNumber + secondNumber,
    };
});

exports.addOffer = functions.https.onCall((data, context) => {
    // return functions.config()
    // console.log(functions.config().firebase);
    let db = admin.firestore();
    // db.collection('offers').get()
    //     .then((snapshot) => {
    //         snapshot.forEach((doc) => {
    //             console.log(doc.id, '=>', doc.data());
    //         });
    //         return snapshot
    //     })
    //     .catch((err) => {
    //         console.log('Error getting documents', err);
    //     });

    let docRef = db.collection('jorge').doc('alovelace');

    return  docRef.set({
        first: 'Ada',
        last: 'Lovelace',
        born: 1815
    }).then(()=>{
        console.log("jorge");
        return "ok"
    })
        .catch((err) => {
            console.log("bahiana");
            console.log(err);
            return 500
        });

});

exports.getOffer = functions.https.onCall((data, context) => {
    let db = admin.firestore();
    return db.collection('offers').get()
        .then((snapshot) => {
            return snapshot.docs.map(doc=>doc.data())
        })
        .catch((err) => {
            console.log('Error getting documents', err);
            return 500
        });

});
