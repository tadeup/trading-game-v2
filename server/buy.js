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

const buyPrice = 15;
const buyQuantity = 6;

docRef.set({offerAsset: "test", offerFilled: buyQuantity, offerIsBuy: true, offerIsCanceled: false, offerIsFilled: false, offerOwnerId: "vdYkId5PLFTdAJE4Ej9OEgqDBuf2", offerPrice: buyPrice, offerQuantity: buyQuantity,})
    .then(()=>{
        return db.collection('test')
            .where('offerAsset', '==', 'test' )
            .where('offerIsCanceled', '==', false)
            .where('offerIsBuy', '==', false)
            .where('offerIsFilled', '==', false)
            .where('offerPrice', '<=', buyPrice)
            .orderBy('offerPrice', 'asc')
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
                    t.update(docRef, {offerFilled: newFilledSelf, offerIsFilled: newIsFilledSelf});
                });
        })
    })
    .then(result => {
        console.log('Transaction success!');
    }).catch(err => {
        console.log('Transaction failure:', err);
    });


