const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const APP_ID = functions.config().algolia.appid;
const ADMIN_KEY = functions.config().algolia.adminkey;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const chirpIndex = client.initIndex('chirps');
const accountIndex = client.initIndex('accounts');

exports.addChirp = functions.firestore
  .document('chirps/{chirpId}')
  .onCreate((snap) => {
    // Get the note document
    const chirp = snap.data();

    console.log('bananan');

    // Add an 'objectID' field which Algolia requires
    chirp.objectID = snap.chirpId;

    // Write to the algolia chirpIndex
    return chirpIndex.saveObject(chirp);
  });

exports.addAccount = functions.firestore
  .document('accounts/{chirpId}')
  .onCreate((snap) => {
    // Get the note document
    const account = snap.data();

    // Add an 'objectID' field which Algolia requires
    account.objectID = snap.userId;

    // Write to the algolia index
    return accountIndex.saveObject(account);
  });
