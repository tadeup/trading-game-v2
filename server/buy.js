const admin = require('firebase-admin');
const ServiceAccount = require('./ServiceAccout');
admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount),
    databaseURL: "https://trading-game-v2.firebaseio.com"
});

const db = admin.firestore();

const docRef = db
    .collection('test')
    .doc('buyOffer');

const offerPrice = 15;
const offerQuantity = 6;
const offerIsBuy = true;
const offerAsset = "test";

docRef.set({offerAsset: offerAsset, offerFilled: offerQuantity, offerIsBuy: offerIsBuy, offerIsCanceled: false, offerIsFilled: false, offerIsReady: false, offerOwnerId: "vdYkId5PLFTdAJE4Ej9OEgqDBuf2", offerPrice: offerPrice, offerQuantity: offerQuantity,})
    .then(()=>{
        return db.collection('test')
            .where('offerAsset', '==', offerAsset )
            .where('offerIsCanceled', '==', false)
            .where('offerIsBuy', '==', false)
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
                            const newTransactionRef = db.collection('transactions').doc();

                            if (newFilledSelf > newFilledOther) {
                                t.set(newTransactionRef, {users: [doc.data().offerOwnerId, ref.data().offerOwnerId], asset: offerAsset, quantity: newFilledOther, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                                newFilledSelf = newFilledSelf - newFilledOther;
                                newFilledOther = 0;
                                t.update(ref.ref, {offerFilled: newFilledOther, offerIsFilled: true});

                            } else if (newFilledSelf === newFilledOther) {
                                t.set(newTransactionRef, {users: [doc.data().offerOwnerId, ref.data().offerOwnerId], asset: offerAsset, quantity: newFilledOther, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                                newFilledOther = 0;
                                newFilledSelf = 0;
                                newIsFilledSelf = true;
                                t.update(ref.ref, {offerFilled: newFilledOther, offerIsFilled: true});

                            } else {
                                t.set(newTransactionRef, {users: [doc.data().offerOwnerId, ref.data().offerOwnerId], asset: offerAsset, quantity: newFilledSelf, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
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
        console.log('Transaction success!');
    }).catch(err => {
        console.log('Transaction failure:', err);
    });


