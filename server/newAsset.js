const admin = require('firebase-admin');
const ServiceAccount = require('./ServiceAccout');
admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount),
    databaseURL: "https://trading-game-v2.firebaseio.com"
});

const assetName = 'tester';
const assetMargin = 100;
const assetIsContinuous = false;
const assetIsActive = true;

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