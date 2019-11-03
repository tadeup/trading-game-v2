const functions = require('firebase-functions');
const admin = require('firebase-admin');
const ServiceAccount = require('./trading-game-v2-firebase-adminsdk-v2057-c3dbace971');
admin.initializeApp(ServiceAccount);

const newAsset = require('./Assets/newAsset');
const newOffer = require('./Offers/newOffer2');
const deleteOffers = require('./Offers/deleteOffers');
const newUser = require('./Users/newUser');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.newOffer = functions.https.onCall(newOffer(admin));

exports.newAsset = functions.https.onCall(newAsset(admin));

exports.deleteOffers = functions.https.onCall(deleteOffers(admin));

exports.newUser = functions.https.onCall(newUser(admin));
