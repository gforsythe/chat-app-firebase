const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.database();
const messaging = admin.messaging();

exports.sendFCM = functions.https.onCall(async (data, context) => {
  checkIfAuth(context);

  const { chatId, title, message } = data;

  const roomSnap = await db.ref(`/rooms/${chatId}`).once("value");

  if (!roomSnap.exists()) {
    return false;
  }

  const roomData = roomSnap.val();

  checkIfAllowed(context, transformToArray(roomData.admins));
  const fcmUsers = transformToArray(roomData.fcmUsers);
  const userTokensPromises = fcmUsers.map(uid => getUserTokens(uid));
  const userTokensResult = await Promise.all(userTokensPromises);
  const tokens = userTokensResult.reduce((accTokens, userTokens) => [...accTokens, ...userTokens], []);
  if (tokens.length === 0) {
    return false;
  }

  const fcmMessage = {
    notification: {
      title: `${title} (${roomData.name})`,
      body: message
    },
    tokens,
  };

  const batchResponse = await messaging.sendMulticast(fcmMessage);
  const failedTokens = [];
  if (batchResponse.failureCount > 0) {
    batchResponse.responses.forEach((resp, idx) => {
      if (!resp.success) {
        failedTokens.push(tokens[idx]);
      }
    });
    console.log(`list of tokens that caused failures:` + failedTokens);
  }

  const removePromises = failedTokens.map(token => db.ref(`/fcm_tokens/${token}`).remove());
  return Promise.all(removePromises).catch(err => err.message)
});


function checkIfAuth(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You have to sign in please'
    );
  }
}

function checkIfAllowed(context, chatAdmins) {
  if (!chatAdmins.includes(context.auth.uid)) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Restricted Access: You are not AUTH'
    );
  }
}


function transformToArray(snapVal) {
  return snapVal ? Object.keys(snapVal) : [];
}

async function getUserTokens(uid) {
  const userTokensSnap = await db.ref(`/fcm_tokens`).orderByValue().equalTo(uid).once("value");
  if (!(await userTokensSnap).hasChildren()) {
    return [];
  }

  return Object.keys((await userTokensSnap).val());
}