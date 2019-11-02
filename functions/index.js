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
        ? metaProfile.positions[offerAsset].open + offerQuantity < metaMargin - metaProfile.positions[offerAsset].closed
        : metaProfile.positions[offerAsset].open - offerQuantity > -metaMargin - metaProfile.positions[offerAsset].closed;
    if (!metaProfile.isAdmin && !hasMargin) {
        return {success: false, error: 'NO_MARGIN'};
    }

    const db = admin.firestore();

    const docRef = db
        .collection('offers')
        .doc();

    const userRef = db
        .collection('users')
        .doc(offerOwnerId);


    const setOffer = docRef.set({
        offerAsset: offerAsset,
        offerFilled: offerQuantity,
        offerIsBuy: offerIsBuy,
        offerIsCanceled: false,
        offerIsFilled: false,
        offerOwnerId: offerOwnerId,
        offerPrice: offerPrice,
        offerQuantity: offerQuantity,
    });

    const setUserOpenMargin = userRef.update({
        ['positions.'+offerAsset+'.open']: offerIsBuy
            ? admin.firestore.FieldValue.increment(offerQuantity)
            : admin.firestore.FieldValue.increment(-offerQuantity)
    });

    return Promise.all([setOffer, setUserOpenMargin])
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
                        const usersClosedMarginUpdate = {[offerOwnerId]: 0};
                        let newFilledSelf = doc.data().offerFilled;
                        let newIsFilledSelf = false;
                        refArray.forEach(ref => {
                            if (!newIsFilledSelf) {
                                let newFilledOther = ref.data().offerFilled;
                                const newTransactionRef = db.collection('transactions').doc();

                                const userOther = ref.data().offerOwnerId;
                                if (!Object.keys(usersClosedMarginUpdate).includes(userOther)){
                                    usersClosedMarginUpdate[userOther] = 0;
                                }

                                if (newFilledSelf > newFilledOther) {
                                    t.set(newTransactionRef, {buyer: offerIsBuy ? doc.data().offerOwnerId : ref.data().offerOwnerId, seller: offerIsBuy ? ref.data().offerOwnerId : doc.data().offerOwnerId, asset: offerAsset, quantity: newFilledOther, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                                    usersClosedMarginUpdate[offerOwnerId] += offerIsBuy ? newFilledOther : -newFilledOther;
                                    usersClosedMarginUpdate[userOther] += offerIsBuy ? -newFilledOther : newFilledOther;
                                    newFilledSelf = newFilledSelf - newFilledOther;
                                    newFilledOther = 0;
                                    t.update(ref.ref, {offerFilled: newFilledOther, offerIsFilled: true});

                                } else if (newFilledSelf === newFilledOther) {
                                    t.set(newTransactionRef, {buyer: offerIsBuy ? doc.data().offerOwnerId : ref.data().offerOwnerId, seller: offerIsBuy ? ref.data().offerOwnerId : doc.data().offerOwnerId, asset: offerAsset, quantity: newFilledOther, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                                    usersClosedMarginUpdate[offerOwnerId] += offerIsBuy ? newFilledOther : -newFilledOther;
                                    usersClosedMarginUpdate[userOther] += offerIsBuy ? -newFilledOther : newFilledOther;
                                    newFilledOther = 0;
                                    newFilledSelf = 0;
                                    newIsFilledSelf = true;
                                    t.update(ref.ref, {offerFilled: newFilledOther, offerIsFilled: true});

                                } else {
                                    t.set(newTransactionRef, {buyer: offerIsBuy ? doc.data().offerOwnerId : ref.data().offerOwnerId, seller: offerIsBuy ? ref.data().offerOwnerId : doc.data().offerOwnerId, asset: offerAsset, quantity: newFilledSelf, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                                    usersClosedMarginUpdate[offerOwnerId] += offerIsBuy ? newFilledSelf : -newFilledSelf;
                                    usersClosedMarginUpdate[userOther] += offerIsBuy ? -newFilledSelf : newFilledSelf;
                                    newFilledOther = newFilledOther - newFilledSelf;
                                    newFilledSelf = 0;
                                    newIsFilledSelf = true;
                                    t.update(ref.ref, {offerFilled: newFilledOther});
                                }
                            }
                        });
                        t.update(docRef, {offerFilled: newFilledSelf, offerIsFilled: newIsFilledSelf});
                        Object.entries(usersClosedMarginUpdate).forEach(userUpdate => {
                            t.update(db.collection('users').doc(userUpdate[0]), {['positions.'+offerAsset+'.closed']: admin.firestore.FieldValue.increment(userUpdate[1]), ['positions.'+offerAsset+'.open']: admin.firestore.FieldValue.increment(-userUpdate[1])});
                        })
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
                batch.update(ref.ref, {['positions.'+assetName]: {open: 0, closed: 0, avgBuyPrice: 0, avgSellPrice: 0, buyQuantity: 0, sellQuantity: 0}});
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

exports.deleteOffers = functions.https.onCall((data, context) => {
    const {offers, offerOwnerId, offerAsset} = data;
    const db = admin.firestore();
    const batch = db.batch();
    let margin = 0;
    offers.forEach(offer => {
        batch.update(db.collection('offers').doc(offer.id), {offerIsCanceled: true});
        margin += offer.offerIsBuy ? -offer.offerFilled : offer.offerFilled
    });
    batch.update(db.collection('users').doc(offerOwnerId), {['positions.'+offerAsset+'.open']: admin.firestore.FieldValue.increment(margin)});

    return batch.commit()
        .then(result => {
            return {success: true,};
        }).catch(err => {
            console.log('Transaction failure:', err);
            return {success: false, error: err};
        });

});

exports.newUser = functions.https.onCall((data, context) => {
    const {email, name, password, isAdmin, positions} = data;
    const db = admin.firestore();
    return admin.auth().createUser({
        email: email,
        password: password,
        displayName: name,
        disabled: false
    })
        .then(function(userRecord) {
            const docRef = db
                .collection('users')
                .doc(userRecord.uid);
            return docRef.set({
                email, name, isAdmin, positions
            })
        })
        .then(() => {
            return {success: true,};
        })
        .catch(function(error) {
            console.log('Error creating new user:', error);
            return {success: false, error: error};
        });

});


exports.newOffer2 = functions.https.onCall((data, context) => {
    const {offerOwnerId, offerAsset, offerQuantity, offerPrice, offerIsBuy, metaMargin, metaProfile} = data;

    const hasMargin = offerIsBuy
        ? metaProfile.positions[offerAsset].open + offerQuantity < metaMargin - metaProfile.positions[offerAsset].closed
        : metaProfile.positions[offerAsset].open - offerQuantity > -metaMargin - metaProfile.positions[offerAsset].closed;
    if (!metaProfile.isAdmin && !hasMargin) {
        return {success: false, error: 'NO_MARGIN'};
    }

    const db = admin.firestore();

    const docRef = db
        .collection('offers')
        .doc();

    const userRef = db
        .collection('users')
        .doc(offerOwnerId);


    const setOffer = docRef.set({
        offerAsset: offerAsset,
        offerFilled: offerQuantity,
        offerIsBuy: offerIsBuy,
        offerIsCanceled: false,
        offerIsFilled: false,
        offerOwnerId: offerOwnerId,
        offerPrice: offerPrice,
        offerQuantity: offerQuantity,
    });

    const setUserOpenMargin = userRef.update({
        ['positions.'+offerAsset+'.open']: offerIsBuy
            ? admin.firestore.FieldValue.increment(offerQuantity)
            : admin.firestore.FieldValue.increment(-offerQuantity)
    });

    return Promise.all([setOffer, setUserOpenMargin])
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
                        const usersClosedMarginUpdate = {[offerOwnerId]: 0};
                        let newFilledSelf = doc.data().offerFilled;
                        let newIsFilledSelf = false;
                        refArray.forEach(ref => {
                            if (!newIsFilledSelf) {
                                let newFilledOther = ref.data().offerFilled;
                                const newTransactionRef = db.collection('transactions').doc();

                                const userOther = ref.data().offerOwnerId;
                                if (!Object.keys(usersClosedMarginUpdate).includes(userOther)){
                                    usersClosedMarginUpdate[userOther] = 0;
                                }

                                if (newFilledSelf > newFilledOther) {
                                    t.set(newTransactionRef, {buyer: offerIsBuy ? doc.data().offerOwnerId : ref.data().offerOwnerId, seller: offerIsBuy ? ref.data().offerOwnerId : doc.data().offerOwnerId, asset: offerAsset, quantity: newFilledOther, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                                    usersClosedMarginUpdate[offerOwnerId] += offerIsBuy ? newFilledOther : -newFilledOther;
                                    usersClosedMarginUpdate[userOther] += offerIsBuy ? -newFilledOther : newFilledOther;
                                    newFilledSelf = newFilledSelf - newFilledOther;
                                    newFilledOther = 0;
                                    t.update(ref.ref, {offerFilled: newFilledOther, offerIsFilled: true});

                                } else if (newFilledSelf === newFilledOther) {
                                    t.set(newTransactionRef, {buyer: offerIsBuy ? doc.data().offerOwnerId : ref.data().offerOwnerId, seller: offerIsBuy ? ref.data().offerOwnerId : doc.data().offerOwnerId, asset: offerAsset, quantity: newFilledOther, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                                    usersClosedMarginUpdate[offerOwnerId] += offerIsBuy ? newFilledOther : -newFilledOther;
                                    usersClosedMarginUpdate[userOther] += offerIsBuy ? -newFilledOther : newFilledOther;
                                    newFilledOther = 0;
                                    newFilledSelf = 0;
                                    newIsFilledSelf = true;
                                    t.update(ref.ref, {offerFilled: newFilledOther, offerIsFilled: true});

                                } else {
                                    t.set(newTransactionRef, {buyer: offerIsBuy ? doc.data().offerOwnerId : ref.data().offerOwnerId, seller: offerIsBuy ? ref.data().offerOwnerId : doc.data().offerOwnerId, asset: offerAsset, quantity: newFilledSelf, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                                    usersClosedMarginUpdate[offerOwnerId] += offerIsBuy ? newFilledSelf : -newFilledSelf;
                                    usersClosedMarginUpdate[userOther] += offerIsBuy ? -newFilledSelf : newFilledSelf;
                                    newFilledOther = newFilledOther - newFilledSelf;
                                    newFilledSelf = 0;
                                    newIsFilledSelf = true;
                                    t.update(ref.ref, {offerFilled: newFilledOther});
                                }
                            }
                        });
                        t.update(docRef, {offerFilled: newFilledSelf, offerIsFilled: newIsFilledSelf});
                        Object.entries(usersClosedMarginUpdate).forEach(userUpdate => {
                            t.update(db.collection('users').doc(userUpdate[0]), {['positions.'+offerAsset+'.closed']: admin.firestore.FieldValue.increment(userUpdate[1]), ['positions.'+offerAsset+'.open']: admin.firestore.FieldValue.increment(-userUpdate[1])});
                        })
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