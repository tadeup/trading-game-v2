module.exports = admin => (data, context) => {
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

};