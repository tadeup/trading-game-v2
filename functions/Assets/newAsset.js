module.exports = (admin) => (data, context) => {
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
                batch.update(ref.ref, {['positions.'+assetName]: {openBuy: 0, openSell: 0, closed: 0, avgBuyPrice: 0, avgSellPrice: 0, buyQuantity: 0, sellQuantity: 0}});
            });
            return batch.commit()
        })
        .then(result => {
            return {success: true,};
        }).catch(err => {
            console.log('Transaction failure:', err);
            return {success: false, error: err};
        });
}