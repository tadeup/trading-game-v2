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
    const {offerOwnerId, offerAsset, offerQuantity, offerPrice, offerIsBuy, metaMargin, metaProfile} = data;

    const hasMargin = offerIsBuy
        ? metaProfile.positions[offerAsset] + offerQuantity < metaMargin
        : metaProfile.positions[offerAsset] - offerQuantity > metaMargin;
    if (!metaProfile.isAdmin && !hasMargin) {
        return {success: false, error: 'NO_MARGIN'};
    }

    const db = admin.firestore();
    const docRef = db
        .collection('offers')
        .doc();

    return docRef
        .set({
            offerAsset: offerAsset,
            offerFilled: offerQuantity,
            offerIsBuy: offerIsBuy,
            offerIsCanceled: false,
            offerIsFilled: false,
            offerOwnerId: offerOwnerId,
            offerPrice: offerPrice,
            offerQuantity: offerQuantity,
        })
        .then(() => {
            return db.collection('offers')
                .where('offerAsset', '==', offerAsset)
                .where('offerIsCanceled', '==', false)
                .where('offerIsBuy', '==', !offerIsBuy)
                .where('offerIsFilled', '==', false)
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
                                const newTransactionRef = db.collection('transactions').doc();

                                if (newFilledSelf > newFilledOther) {
                                    t.set(newTransactionRef, {buyer: offerIsBuy ? doc.data().offerOwnerId : ref.data().offerOwnerId, seller: offerIsBuy ? ref.data().offerOwnerId : doc.data().offerOwnerId, asset: offerAsset, quantity: newFilledOther, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                                    newFilledSelf = newFilledSelf - newFilledOther;
                                    newFilledOther = 0;
                                    t.update(ref.ref, {offerFilled: newFilledOther, offerIsFilled: true});

                                } else if (newFilledSelf === newFilledOther) {
                                    t.set(newTransactionRef, {buyer: offerIsBuy ? doc.data().offerOwnerId : ref.data().offerOwnerId, seller: offerIsBuy ? ref.data().offerOwnerId : doc.data().offerOwnerId, asset: offerAsset, quantity: newFilledOther, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                                    newFilledOther = 0;
                                    newFilledSelf = 0;
                                    newIsFilledSelf = true;
                                    t.update(ref.ref, {offerFilled: newFilledOther, offerIsFilled: true});

                                } else {
                                    t.set(newTransactionRef, {buyer: offerIsBuy ? doc.data().offerOwnerId : ref.data().offerOwnerId, seller: offerIsBuy ? ref.data().offerOwnerId : doc.data().offerOwnerId, asset: offerAsset, quantity: newFilledSelf, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                                    newFilledOther = newFilledOther - newFilledSelf;
                                    newFilledSelf = 0;
                                    newIsFilledSelf = true;
                                    t.update(ref.ref, {offerFilled: newFilledOther});
                                }
                            }
                        });
                        t.update(docRef, {offerFilled: newFilledSelf, offerIsFilled: newIsFilledSelf});
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

exports.newAsset = functions.https.onCall((data, context) => {
    const {assetName, assetMargin, assetIsContinuous, assetIsActive} = data;
    const db = admin.firestore();
    const docRef = db
        .collection('assets')
        .doc();

    return docRef
        .set({
            assetName: assetName,
            assetMargin: assetMargin,
            assetIsContinuous: assetIsContinuous,
            assetIsActive: assetIsActive,
        })
        .then(() => {
            return db.collection('users').get()
        })
        .then(refArray => {
            if (refArray.empty) {
                console.log('No matching documents.');
                return;
            }

            let batch = db.batch();
            refArray.forEach(ref => {
                batch.update(ref.ref, {['positions.'+assetName]: 0});
            });
            return batch.commit()
        })
        .then(result => {
            return {success: true,};
        }).catch(err => {
            console.log('Transaction failure:', err);
            return {success: false, error: err};
        });
});
