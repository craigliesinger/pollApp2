import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.updateSentiment = functions.firestore.document('surveys/{surveyId}/questions/{questionId}').onUpdate((change, context) => {
    const data = change.after.data()
    if (data.type !== "openText") {
        return null
    } else {
        let text = "";
        var answer = data.answers as any[];
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