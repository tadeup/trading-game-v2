const functions = require('firebase-functions');
const admin = require('firebase-admin');
const ServiceAccount = require('./trading-game-v2-firebase-adminsdk-v2057-c3dbace971');
admin.initializeApp(ServiceAccount);

const newAsset = require('./Assets/newAsset');
const newOffer = require('./Offers/newOffer');
const deleteOffers = require('./Offers/deleteOffers');
const newUser = require('./Users/newUser');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.newOffer = functions.https.onCall(newOffer(admin));

exports.newAsset = functions.https.onCall(newAsset(admin));

exports.deleteOffers = functions.https.onCall(deleteOffers(admin));

exports.newUser = functions.https.onCall(newUser(admin));


exports.newOffer2 = functions.https.onCall((data, context) => {
    const {offerOwnerId, offerAsset, offerQuantity, offerPrice, offerIsBuy, metaMargin, metaProfile} = data;
    if (offerOwnerId===undefined || offerAsset===undefined || offerQuantity===undefined || offerPrice===undefined || offerIsBuy===undefined || metaMargin===undefined || metaProfile===undefined) {
        return {success: false, error: 'MISSING_PARAMETER'};
    }

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


    const offerDoc = {
        offerAsset: offerAsset,
        offerFilled: offerQuantity,
        offerIsBuy: offerIsBuy,
        offerIsCanceled: false,
        offerIsFilled: false,
        offerOwnerId: offerOwnerId,
        offerPrice: offerPrice,
        offerQuantity: offerQuantity,
    };

    const setOffer = docRef.set(offerDoc);

    const setUserOpenMargin = userRef.update({
        ['positions.'+offerAsset+'.open']: offerIsBuy
            ? admin.firestore.FieldValue.increment(offerQuantity)
            : admin.firestore.FieldValue.increment(-offerQuantity)
    });

    const getOffers = db.collection('offers')
        .where('offerAsset', '==', offerAsset)
        .where('offerIsCanceled', '==', false)
        .where('offerIsBuy', '==', !offerIsBuy)
        .where('offerIsFilled', '==', false)
        .where('offerPrice', offerIsBuy ? '<=' : '>=', offerPrice)
        .orderBy('offerPrice', offerIsBuy ? 'asc' : 'desc')
        .get();

    return Promise.all([setOffer, setUserOpenMargin, getOffers])
        .then(resArray => {
            const refOffers = resArray[2];

            if (refOffers.empty) {
                console.log('No matching documents.');
                return;
            }

            const batch = db.batch();
            const usersPositionUpdate = {[offerOwnerId]: {open: 0, closed: 0, avgBuyPrice: 0, avgSellPrice: 0, buyQuantity: 0, sellQuantity: 0}};
            let newFilledSelf = offerDoc.offerFilled;
            let newIsFilledSelf = false;
            refOffers.forEach(ref => {
                if (!newIsFilledSelf) {
                    let newFilledOther = ref.data().offerFilled;
                    const newTransactionRef = db.collection('transactions').doc();

                    const userOther = ref.data().offerOwnerId;
                    if (!Object.keys(usersPositionUpdate).includes(userOther)){
                        usersPositionUpdate[userOther] = {open: 0, closed: 0, avgBuyPrice: 0, avgSellPrice: 0, buyQuantity: 0, sellQuantity: 0};
                    }

                    if (newFilledSelf > newFilledOther) {
                        batch.set(newTransactionRef, {buyer: offerIsBuy ? offerDoc.offerOwnerId : ref.data().offerOwnerId, seller: offerIsBuy ? ref.data().offerOwnerId : offerDoc.offerOwnerId, asset: offerAsset, quantity: newFilledOther, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                        usersPositionUpdate[offerOwnerId].closed += offerIsBuy ? newFilledOther : -newFilledOther;
                        usersPositionUpdate[userOther].closed += offerIsBuy ? -newFilledOther : newFilledOther;
                        newFilledSelf = newFilledSelf - newFilledOther;
                        newFilledOther = 0;
                        batch.update(ref.ref, {offerFilled: newFilledOther, offerIsFilled: true});

                    } else if (newFilledSelf === newFilledOther) {
                        batch.set(newTransactionRef, {buyer: offerIsBuy ? offerDoc.offerOwnerId : ref.data().offerOwnerId, seller: offerIsBuy ? ref.data().offerOwnerId : offerDoc.offerOwnerId, asset: offerAsset, quantity: newFilledOther, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                        usersPositionUpdate[offerOwnerId].closed += offerIsBuy ? newFilledOther : -newFilledOther;
                        usersPositionUpdate[userOther].closed += offerIsBuy ? -newFilledOther : newFilledOther;
                        newFilledOther = 0;
                        newFilledSelf = 0;
                        newIsFilledSelf = true;
                        batch.update(ref.ref, {offerFilled: newFilledOther, offerIsFilled: true});

                    } else {
                        batch.set(newTransactionRef, {buyer: offerIsBuy ? offerDoc.offerOwnerId : ref.data().offerOwnerId, seller: offerIsBuy ? ref.data().offerOwnerId : offerDoc.offerOwnerId, asset: offerAsset, quantity: newFilledSelf, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                        usersPositionUpdate[offerOwnerId].closed += offerIsBuy ? newFilledSelf : -newFilledSelf;
                        usersPositionUpdate[userOther].closed += offerIsBuy ? -newFilledSelf : newFilledSelf;
                        newFilledOther = newFilledOther - newFilledSelf;
                        newFilledSelf = 0;
                        newIsFilledSelf = true;
                        batch.update(ref.ref, {offerFilled: newFilledOther});
                    }
                }
            });
            batch.update(docRef, {offerFilled: newFilledSelf, offerIsFilled: newIsFilledSelf});
            Object.entries(usersPositionUpdate).forEach(userUpdate => {
                batch.update(
                    db.collection('users').doc(userUpdate[0]),
                    {
                        ['positions.'+offerAsset+'.closed']: admin.firestore.FieldValue.increment(userUpdate[1].closed),
                        ['positions.'+offerAsset+'.open']: admin.firestore.FieldValue.increment(-userUpdate[1].closed)
                    }
                );
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