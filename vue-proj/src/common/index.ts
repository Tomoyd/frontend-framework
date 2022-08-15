export function deleteItems<T>(res: T[], omits: T[]) {
  if (omits.length === 0) {
    return res;
  }

  const compare = (item: T) => {
    if (omits.length === 0) {
      return () => true;
    }
    const index = omits.indexOf(item);
    const omit = omits.splice(index, 1);
    return omit.length === 0;
  };
  return res.filter(compare);
}
