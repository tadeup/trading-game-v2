const admin = require('firebase-admin');
const ServiceAccount = require('./ServiceAccout');
admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount),
    databaseURL: "https://trading-game-v2.firebaseio.com"
});

const db = admin.firestore();

exports.db = db;




// let db = admin.firestore();
// const offerAsset = 'teste';
// const offerPrice = 11;
// const offerIsBuy = true;
//
// const offers = db.collection('offers')
//     .where('offerAsset', '==', offerAsset )
//     .where('offerIsCanceled', '==', false)
//     .where('offerIsBuy', '==', !offerIsBuy)
//     .where('offerIsFilled', '==', false)
//     .where('offerPrice', offerIsBuy ? '<=' : '>=', offerPrice)
//     .orderBy('offerPrice', offerIsBuy ? 'asc' : 'desc');
//
// const res = offers
//     .get()
//     .then(snapshot => {
//         return snapshot.docs.map(doc=>doc.data())
//     })
//     .then(el=>{console.log(el)});




// const transaction = db.runTransaction(t => {
//     t.get(offers)
//         .then((snapshot) => {
//             const newOffer = [{ offerOwnerId, offerAsset, offerQuantity, offerFilled, offerPrice, offerIsBuy, offerIsCanceled, offerIsFilled }];
//             snapshot.forEach(doc=>{
//                 newOffer[0].offerFilled += doc.data().offerQuantity;
//                 newOffer.push(doc.data())
//             });
//             return newOffer
//             // return snapshot.docs.map(doc=>doc.data())
//         })
//         .catch((err) => {
//             console.log('Error getting documents', err);
//             return 500
//         });
// });