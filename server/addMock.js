const admin = require('firebase-admin');
const ServiceAccount = require('./ServiceAccout');
admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount),
    databaseURL: "https://trading-game-v2.firebaseio.com"
});

const db = admin.firestore();

let docRef = db.collection('test');

// docRef
//     .add({offerAsset: "test", offerFilled: 0, offerIsBuy: false, offerIsCanceled: false, offerIsFilled: false, offerOwnerId: "vdYkId5PLFTdAJE4Ej9OEgqDBuf2", offerPrice: 15, offerQuantity: 5, offerIsReady: true})
//     .then(ref=>{console.log(ref)});

docRef
    .doc('doc01')
    .set({offerAsset: "test", offerFilled: 5, offerIsBuy: true, offerIsCanceled: false, offerIsFilled: false, offerOwnerId: "vdYkId5PLFTdAJE4Ej9OEgqDBuf2", offerPrice: 4, offerQuantity: 5, offerIsReady: true})
    .then(ref=>{console.log(ref)});

docRef
    .doc('doc02')
    .set({offerAsset: "test", offerFilled: 5, offerIsBuy: true, offerIsCanceled: false, offerIsFilled: false, offerOwnerId: "vdYkId5PLFTdAJE4Ej9OEgqDBuf2", offerPrice: 6, offerQuantity: 5, offerIsReady: true})
    .then(ref=>{console.log(ref)});

docRef
    .doc('doc03')
    .set({offerAsset: "test", offerFilled: 5, offerIsBuy: true, offerIsCanceled: false, offerIsFilled: false, offerOwnerId: "vdYkId5PLFTdAJE4Ej9OEgqDBuf2", offerPrice: 8, offerQuantity: 5, offerIsReady: true})
    .then(ref=>{console.log(ref)});

docRef
    .doc('doc04')
    .set({offerAsset: "test", offerFilled: 5, offerIsBuy: false, offerIsCanceled: false, offerIsFilled: false, offerOwnerId: "vdYkId5PLFTdAJE4Ej9OEgqDBuf2", offerPrice: 12, offerQuantity: 5, offerIsReady: true})
    .then(ref=>{console.log(ref)});

docRef
    .doc('doc05')
    .set({offerAsset: "test", offerFilled: 5, offerIsBuy: false, offerIsCanceled: false, offerIsFilled: false, offerOwnerId: "vdYkId5PLFTdAJE4Ej9OEgqDBuf2", offerPrice: 14, offerQuantity: 5, offerIsReady: true})
    .then(ref=>{console.log(ref)});

docRef
    .doc('doc06')
    .set({offerAsset: "test", offerFilled: 5, offerIsBuy: false, offerIsCanceled: false, offerIsFilled: false, offerOwnerId: "vdYkId5PLFTdAJE4Ej9OEgqDBuf2", offerPrice: 16, offerQuantity: 5, offerIsReady: true})
    .then(ref=>{console.log(ref)});