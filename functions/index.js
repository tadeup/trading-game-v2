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

exports.newOffer = functions.https.onCall((data, context) => {
    const {offerOwnerId, offerAsset, offerQuantity, offerPrice, offerIsBuy} = data;
    const db = admin.firestore();
    const docRef = db
        .collection('test')
        .doc();

    return docRef
        .set({
            offerAsset: offerAsset,
            offerFilled: offerQuantity,
            offerIsBuy: offerIsBuy,
            offerIsCanceled: false,
            offerIsFilled: false,
            offerIsReady: false,
            offerOwnerId: offerOwnerId,
            offerPrice: offerPrice,
            offerQuantity: offerQuantity,
        })
        .then(()=>{
            return db.collection('test')
                .where('offerAsset', '==', offerAsset )
                .where('offerIsCanceled', '==', false)
                .where('offerIsBuy', '==', !offerIsBuy)
                .where('offerIsFilled', '==', false)
                .where('offerIsReady', '==', true)
                .where('offerPrice', offerIsBuy ? '<=' : '>=', offerPrice)
                .orderBy('offerPrice', offerIsBuy ? 'asc' : 'desc')
                .get()
        })
        .then(refArray => {
            if (refArray.empty) {
                console.log('No matching documents.');
                return;
            }

            return db.runTransaction(t => {
                return t.get(docRef)
                    .then(doc => {
                        let newFilledSelf = doc.data().offerFilled;
                        let newIsFilledSelf = false;
                        refArray.forEach(ref => {
                            if (!newIsFilledSelf) {
                                let newFilledOther = ref.data().offerFilled;
                                if (newFilledSelf > newFilledOther) {
                                    newFilledSelf = newFilledSelf - newFilledOther;
                                    newFilledOther = 0;
                                    t.update(ref.ref, {offerFilled: newFilledOther, offerIsFilled: true});
                                } else if (newFilledSelf === newFilledOther) {
                                    newFilledOther = 0;
                                    newFilledSelf = 0;
                                    newIsFilledSelf = true;
                                    t.update(ref.ref, {offerFilled: newFilledOther, offerIsFilled: true});
                                } else {
                                    newFilledOther = newFilledOther - newFilledSelf;
                                    newFilledSelf = 0;
                                    newIsFilledSelf = true;
                                    t.update(ref.ref, {offerFilled: newFilledOther});
                                }
                            }
                        });
                        t.update(docRef, {offerFilled: newFilledSelf, offerIsFilled: newIsFilledSelf, offerIsReady: true});
                    });
            })
        })
        .then(result => {
            return {success: true,};
        }).catch(err => {
            console.log('Transaction failure:', err);
            return {success: false, error: err};
        });


});
