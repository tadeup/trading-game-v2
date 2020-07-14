module.exports = admin => (data, context) => {
    const {offers, offerOwnerId, offerAsset} = data;
    const db = admin.firestore();
    const batch = db.batch();
    let marginBuy = 0;
    let marginSell = 0;
    offers.forEach(offer => {
        batch.update(db.collection('offers').doc(offer.id), {offerIsCanceled: true});
        if (offer.offerIsBuy) {
            marginBuy += -offer.offerFilled
        } else {
            marginSell += -offer.offerFilled
        }
    });
    batch.update(
      db.collection('users').doc(offerOwnerId), {
          ['positions.'+offerAsset+'.openBuy']: admin.firestore.FieldValue.increment(marginBuy),
          ['positions.'+offerAsset+'.openSell']: admin.firestore.FieldValue.increment(marginSell)
      }
    );

    return batch.commit()
        .then(result => {
            return {success: true,};
        }).catch(err => {
            console.log('Transaction failure:', err);
            return {success: false, error: err};
        });

};