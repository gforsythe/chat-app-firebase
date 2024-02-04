export function getNameInitials(name) {
  const spiltName = name.toUpperCase().split(' ');
  if (spiltName.length > 1) {
    return spiltName[0][0] + spiltName[1][0];

  }
  return spiltName[0][0];
}

