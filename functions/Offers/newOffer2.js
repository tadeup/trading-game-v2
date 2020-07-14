module.exports = admin => (data, context) => {
    const {offerOwnerId, offerAsset, offerQuantity, offerPrice, offerIsBuy, metaMargin, metaProfile} = data;

    if (offerOwnerId===undefined || offerAsset===undefined || offerQuantity===undefined || offerPrice===undefined || offerIsBuy===undefined || metaMargin===undefined || metaProfile===undefined) {
        return {success: false, error: 'MISSING_PARAMETER'};
    }

    const hasMargin = offerIsBuy
        ? metaProfile.positions[offerAsset].openBuy + offerQuantity <= metaMargin - metaProfile.positions[offerAsset].closed
        : metaProfile.positions[offerAsset].openSell + offerQuantity <= metaMargin + metaProfile.positions[offerAsset].closed;

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

    const setUserOpenMargin = userRef.update(offerIsBuy
      ? { ['positions.'+offerAsset+'.openBuy']: admin.firestore.FieldValue.increment(offerQuantity) }
      : { ['positions.'+offerAsset+'.openSell']: admin.firestore.FieldValue.increment(offerQuantity) }
    );

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

            const usersList = [offerOwnerId];
            refOffers.forEach(ref => {
                const userOther = ref.data().offerOwnerId;
                if (!usersList.includes(userOther)){
                    usersList.push(userOther);
                }
            });

            return db.runTransaction(t => {
                const userGetArray = usersList.map(el=>t.get(db.collection('users').doc(el)));
                return Promise.all(userGetArray)
                    .then(userRefs=>{
                        const usersPositionUpdate = {};
                        userRefs.forEach(el=>{
                            usersPositionUpdate[el.id] = el.data().positions[offerAsset]
                        });

                        let newFilledSelf = offerDoc.offerFilled;
                        let newIsFilledSelf = false;
                        refOffers.forEach(ref => {
                            if (!newIsFilledSelf) {
                                let newFilledOther = ref.data().offerFilled;
                                const newTransactionRef = db.collection('transactions').doc();

                                const userOther = ref.data().offerOwnerId;

                                if (newFilledSelf > newFilledOther) {
                                    t.set(newTransactionRef, {buyer: offerIsBuy ? offerDoc.offerOwnerId : ref.data().offerOwnerId, seller: offerIsBuy ? ref.data().offerOwnerId : offerDoc.offerOwnerId, asset: offerAsset, quantity: newFilledOther, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                                    usersPositionUpdate[offerOwnerId].closed += offerIsBuy ? newFilledOther : -newFilledOther;
                                    usersPositionUpdate[userOther].closed += offerIsBuy ? -newFilledOther : newFilledOther;
                                    if (offerIsBuy) {
                                        usersPositionUpdate[offerOwnerId].buyQuantity += newFilledOther;
                                        usersPositionUpdate[offerOwnerId].avgBuyPrice += newFilledOther * ref.data().offerPrice;
                                        usersPositionUpdate[userOther].sellQuantity += newFilledOther;
                                        usersPositionUpdate[userOther].avgSellPrice += newFilledOther * ref.data().offerPrice;
                                        usersPositionUpdate[offerOwnerId].openBuy += -newFilledOther;
                                        usersPositionUpdate[userOther].openSell += -newFilledOther;
                                    } else {
                                        usersPositionUpdate[userOther].buyQuantity += newFilledOther;
                                        usersPositionUpdate[userOther].avgBuyPrice += newFilledOther * ref.data().offerPrice;
                                        usersPositionUpdate[offerOwnerId].sellQuantity += newFilledOther;
                                        usersPositionUpdate[offerOwnerId].avgSellPrice += newFilledOther * ref.data().offerPrice;
                                        usersPositionUpdate[offerOwnerId].openSell += -newFilledOther;
                                        usersPositionUpdate[userOther].openBuy += -newFilledOther;
                                    }
                                    newFilledSelf = newFilledSelf - newFilledOther;
                                    newFilledOther = 0;
                                    t.update(ref.ref, {offerFilled: newFilledOther, offerIsFilled: true});

                                } else if (newFilledSelf === newFilledOther) {
                                    t.set(newTransactionRef, {buyer: offerIsBuy ? offerDoc.offerOwnerId : ref.data().offerOwnerId, seller: offerIsBuy ? ref.data().offerOwnerId : offerDoc.offerOwnerId, asset: offerAsset, quantity: newFilledOther, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                                    usersPositionUpdate[offerOwnerId].closed += offerIsBuy ? newFilledOther : -newFilledOther;
                                    usersPositionUpdate[userOther].closed += offerIsBuy ? -newFilledOther : newFilledOther;
                                    if (offerIsBuy) {
                                        usersPositionUpdate[offerOwnerId].buyQuantity += newFilledOther;
                                        usersPositionUpdate[offerOwnerId].avgBuyPrice += newFilledOther * ref.data().offerPrice;
                                        usersPositionUpdate[userOther].sellQuantity += newFilledOther;
                                        usersPositionUpdate[userOther].avgSellPrice += newFilledOther * ref.data().offerPrice;
                                        usersPositionUpdate[offerOwnerId].openBuy += -newFilledOther;
                                        usersPositionUpdate[userOther].openSell += -newFilledOther;
                                    } else {
                                        usersPositionUpdate[userOther].buyQuantity += newFilledOther;
                                        usersPositionUpdate[userOther].avgBuyPrice += newFilledOther * ref.data().offerPrice;
                                        usersPositionUpdate[offerOwnerId].sellQuantity += newFilledOther;
                                        usersPositionUpdate[offerOwnerId].avgSellPrice += newFilledOther * ref.data().offerPrice;
                                        usersPositionUpdate[offerOwnerId].openSell += -newFilledOther;
                                        usersPositionUpdate[userOther].openBuy += -newFilledOther;
                                    }
                                    newFilledOther = 0;
                                    newFilledSelf = 0;
                                    newIsFilledSelf = true;
                                    t.update(ref.ref, {offerFilled: newFilledOther, offerIsFilled: true});

                                } else {
                                    t.set(newTransactionRef, {buyer: offerIsBuy ? offerDoc.offerOwnerId : ref.data().offerOwnerId, seller: offerIsBuy ? ref.data().offerOwnerId : offerDoc.offerOwnerId, asset: offerAsset, quantity: newFilledSelf, price: ref.data().offerPrice, date: admin.firestore.FieldValue.serverTimestamp()});
                                    usersPositionUpdate[offerOwnerId].closed += offerIsBuy ? newFilledSelf : -newFilledSelf;
                                    usersPositionUpdate[userOther].closed += offerIsBuy ? -newFilledSelf : newFilledSelf;
                                    newFilledOther = newFilledOther - newFilledSelf;
                                    if (offerIsBuy) {
                                        usersPositionUpdate[offerOwnerId].buyQuantity += newFilledSelf;
                                        usersPositionUpdate[offerOwnerId].avgBuyPrice += newFilledSelf * ref.data().offerPrice;
                                        usersPositionUpdate[userOther].sellQuantity += newFilledSelf;
                                        usersPositionUpdate[userOther].avgSellPrice += newFilledSelf * ref.data().offerPrice;
                                        usersPositionUpdate[offerOwnerId].openBuy += -newFilledSelf;
                                        usersPositionUpdate[userOther].openSell += -newFilledSelf;
                                    } else {
                                        usersPositionUpdate[userOther].buyQuantity += newFilledSelf;
                                        usersPositionUpdate[userOther].avgBuyPrice += newFilledSelf * ref.data().offerPrice;
                                        usersPositionUpdate[offerOwnerId].sellQuantity += newFilledSelf;
                                        usersPositionUpdate[offerOwnerId].avgSellPrice += newFilledSelf * ref.data().offerPrice;
                                        usersPositionUpdate[offerOwnerId].openSell += -newFilledSelf;
                                        usersPositionUpdate[userOther].openBuy += -newFilledSelf;
                                    }
                                    newFilledSelf = 0;
                                    newIsFilledSelf = true;
                                    t.update(ref.ref, {offerFilled: newFilledOther});
                                }
                            }
                        });
                        t.update(docRef, {offerFilled: newFilledSelf, offerIsFilled: newIsFilledSelf});
                        Object.entries(usersPositionUpdate).forEach(userUpdate => {
                            t.update(
                                db.collection('users').doc(userUpdate[0]),
                                {
                                    ['positions.'+offerAsset+'.closed']: userUpdate[1].closed,
                                    ['positions.'+offerAsset+'.openBuy']: userUpdate[1].openBuy,
                                    ['positions.'+offerAsset+'.openSell']: userUpdate[1].openSell,
                                    ['positions.'+offerAsset+'.avgSellPrice']: userUpdate[1].avgSellPrice,
                                    ['positions.'+offerAsset+'.avgBuyPrice']: userUpdate[1].avgBuyPrice,
                                    ['positions.'+offerAsset+'.sellQuantity']: userUpdate[1].sellQuantity,
                                    ['positions.'+offerAsset+'.buyQuantity']: userUpdate[1].buyQuantity,
                                }
                            );
                        });
                    })
            });
        })
        .then(result => {
            return {success: true,};
        }).catch(err => {
            console.log('Transaction failure:', err);
            return {success: false, error: err};
        });
};