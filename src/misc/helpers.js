export function getNameInitials(name) {
  const spiltName = name.toUpperCase().split(' ');
  if (spiltName.length > 1) {
    return spiltName[0][0] + spiltName[1][0];

  }
  return spiltName[0][0];
}

export function transformToArrayWithId(snapshotValue) {
  return snapshotValue ? Object.keys(snapshotValue).map(roomId => {
    return { ...snapshotValue[roomId], id: roomId };
  }) : [];
}

export async function getUserUpdates(userId, keyToUpdate, value, db) {
  const updates = {};
  updates[`/profiles/${userId}/${keyToUpdate}`] = value;

  const getMsgs = db.ref(`/messages`).orderByChild(`author/uid`).equalTo(userId).once('value');
  const getRooms = db.ref(`/rooms`).orderByChild('lastMessage/author/uid').equalTo(userId).once('value')

  const [messageSnap, roomSnap] = await Promise.all([getMsgs, getRooms])

  messageSnap.forEach(msnap => {
    updates[`/messages/${msnap.key}/author/${keyToUpdate}`] = value;
  });
  roomSnap.forEach(rsnap => {
    updates[`/rooms/${rsnap.key}/lastMessage/author/${keyToUpdate}`] = value;
  });

  return updates;
}