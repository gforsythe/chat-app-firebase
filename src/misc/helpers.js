export function getNameInitials(name) {
  const spiltName = name.toUpperCase().split(' ');
  if (spiltName.length > 1) {
    return spiltName[0][0] + spiltName[1][0];

  }
  return spiltName[0][0];
}

export function  transformToArrayWithId(snapshotValue){
  return snapshotValue ? Object.keys(snapshotValue).map(roomId =>{
    return {...snapshotValue[roomId], id:roomId}
  }) : []
}