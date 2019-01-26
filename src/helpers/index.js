const sortArrayOfObjects = ({ array, sortByKey, sortByKeyType, sortDirection = 'desc' }) => {
  if (sortByKeyType === 'string') {
    const arr = array.sort((a, b) => {
      if (a[sortByKey].toLowerCase() < b[sortByKey].toLowerCase()) {
        return -1;
      } else if (a[sortByKey].toLowerCase() > b[sortByKey].toLowerCase()) {
        return 1;
      }
      return 0;
    });
    return (sortDirection === 'desc' ? arr : arr.reverse());
  } else if (sortByKeyType === 'number') {
    const arr = array.sort((a, b) => (a[sortByKey] - b[sortByKey]));
    return (sortDirection === 'desc' ? arr : arr.reverse());
  }
  return array;
};

const paginateArray = ({ array, itemsPerPage, page }) => {
  const totalItems = array.length;
  const startIndex = (itemsPerPage * (page - 1));
  const endIndex = (startIndex + itemsPerPage);
  return array.slice(startIndex, (endIndex <= totalItems ? endIndex : totalItems));
};

const objectDeepUpdate = (propPath, value, object) => {
  if (propPath.length > 1) {
    return objectDeepUpdate(propPath.slice(1), value, object[propPath[0]]);
  }
  object[propPath[0]] = value; // eslint-disable-line
  return true;
};

export default {
  sortArrayOfObjects,
  paginateArray,
  objectDeepUpdate,
};
