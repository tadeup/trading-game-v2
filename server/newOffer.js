const admin = require('firebase-admin');
const ServiceAccount = require('./ServiceAccout');
admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount),
    databaseURL: "https://trading-game-v2.firebaseio.com"
});

const data = {
    offerOwnerId: 'vdYkId5PLFTdAJE4Ej9OEgqDBuf2',
    offerAsset: 'teste',
    offerQuantity: 10,
    offerPrice: 10,
    offerIsBuy: true,
    metaMargin: 100,
    metaProfile: {
        email: "tadeup1@gmail.com",
        name: 'tadeu admin',
        isAdmin: false,
        isEmpty: false,
        isLoaded: true,
        positions: {
            teste: {
                open: 0,
                closed: 0,
                avgBuyPrice: 0,
                avgSellPrice: 0,
                buyQuantity: 0,
                sellQuantity: 0
            }
        }
    }
};

const newOffer = (data, context) => {
    const {offerOwnerId, offerAsset, offerQuantity, offerPrice, offerIsBuy, metaMargin, metaProfile} = data;

};

newOffer(data);