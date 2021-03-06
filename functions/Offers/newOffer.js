module.exports = admin => (data, context) => {
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


};