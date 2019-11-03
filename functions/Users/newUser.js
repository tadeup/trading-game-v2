module.exports = admin => (data, context) => {
    const {email, name, password, isAdmin, positions} = data;
    const db = admin.firestore();
    return admin.auth().createUser({
        email: email,
        password: password,
        displayName: name,
        disabled: false
    })
        .then(function(userRecord) {
            const docRef = db
                .collection('users')
                .doc(userRecord.uid);
            return docRef.set({
                email, name, isAdmin, positions
            })
        })
        .then(() => {
            return {success: true,};
        })
        .catch(function(error) {
            console.log('Error creating new user:', error);
            return {success: false, error: error};
        });

}