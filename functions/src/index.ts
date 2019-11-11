import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Updates word answer sentiments
exports.updateSentiment = functions.firestore.document('surveys/{surveyId}/questions/{questionId}').onUpdate((change, context) => {
    const data = change.after.data()
    if (data.type !== "openText") {
        return null
    } else {
        let text = "";
        let answer = data.answers as any[];
        answer.forEach(ans => {
            text = text + ans.responce[0] + " ";
        });
        const Sentiment = require('sentiment');
        const sentiment = new Sentiment();
        const result = sentiment.analyze(text);
        const subResult = sentiment.analyze(answer[answer.length-1].responce[0]);
        answer[answer.length-1].sentiment = subResult
        return change.after.ref.set({sentiment: result, answers: answer}, {merge: true});
    }
});

// Manages active attendees by removing disconnected users

exports.onUserStatusChanged = functions.database.ref('/surveys/{survId}/{uid}').onCreate(
    async (snapshot, context) => {
      // Get the data written to Realtime Database
      const eventStatus = snapshot.val();
        console.log(eventStatus);
      // corresponding Firestore document.
      const ref = firestore.doc('surveys/'+context.params.survId);

      const refDelete = admin.database().ref('/surveys/'+context.params.survId+'/'+context.params.uid);
      refDelete.remove();

      return ref.update({
        activeParticipants: admin.firestore.FieldValue.arrayRemove(context.params.uid),
        combinedRating: admin.firestore.FieldValue.increment(eventStatus.rating)
      });

    });



exports.addShortCode = functions.https.onCall(async (data) => {
  console.log('entered function ', data.survId);
  const survId = data.survId;
  const choices = ["0","1","2","3","4","5","6","7","8","9"];
  let codeFound = false;
  let randomCode = "";
  
  while (!codeFound) {
    randomCode = "";
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * 10);
      randomCode = randomCode + choices[randomIndex];
    }
    
    const surveysRef = firestore.collection('surveys').where('shortCode', '==', randomCode).limit(1);
    await surveysRef.get().then(async (snapshot) => {
      if (snapshot.empty) {
        console.log('snapshot empty');
        // code is unique. assign shortCode to survey list
        const writeRef = firestore.doc('surveys/'+survId);
        await writeRef.set({
          shortCode: randomCode
        }, {merge: true}).then(() => {
          console.log('code found');
          codeFound = true;
          return { shortCode: randomCode };
        }).catch((err) => {
          console.log('Error writing shortCode to document', err);
        });
      } else {
        // already exists, first check age of existing entry. retry random code generation loop
        console.log('short code print ', snapshot[0])
        snapshot.forEach(doc => {
          if (doc.lastUserAddTimestamp) {
            const codeDate = doc.lastUserAddTimestamp.toDate();
            let todayMinus30 = new Date();
            todayMinus30.setDate(todayMinus30.getDate() - 30); 
            if (codeDate < todayMinus30) {
              // survey code is older than 30 days since last user log in. so replace.
              doc.update({
                shortCode: ""
              }).then(async () => {
                const writeRef = firestore.doc('surveys/'+survId);
                await writeRef.update({
                  shortCode: randomCode
                }).then(() => {
                  codeFound = true;
                  console.log('code found2');
                  return { shortCode: randomCode };
                }).catch((err) => {
                  console.log('Error writing shortCode to document', err);
                });
              }).catch((err) => {
                console.log('Error erasing shortCode from older survey', err);
              });
            }
          }
        });
      }
    }).catch((err) => {
      console.log('Error getting documents', err);
    });
  }
  
  console.log('about to return ', randomCode);
  return { shortCode: randomCode };
});

