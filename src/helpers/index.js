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

const openApiObjectToFlatObject = (openApiObject, flatObject) => {
  const keys = Object.keys(openApiObject);
  for (let i = 0; i < keys.length; i += 1) {
    const { type } = openApiObject[keys[i]];
    if (type === 'object') {
      flatObject[keys[i]] = {}; // eslint-disable-line
      openApiObjectToFlatObject(openApiObject[keys[i]].properties, flatObject[keys[i]]);
    } else {
      const { value, example } = openApiObject[keys[i]];
      flatObject[keys[i]] = value || example; // eslint-disable-line
    }
  }
};

const mergeFlatObjectIntoOpenApiObject = (openApiObject, flatObject, mergedObject) => {
  const keys = Object.keys(openApiObject);
  for (let i = 0; i < keys.length; i += 1) {
    const { type } = openApiObject[keys[i]];
    if (type === 'object') {
      mergedObject[keys[i]] = { ...openApiObject[keys[i]] }; // eslint-disable-line
      const subFlatChild = (flatObject ? flatObject[keys[i]] : null);
      mergeFlatObjectIntoOpenApiObject(
        openApiObject[keys[i]].properties,
        subFlatChild,
        mergedObject[keys[i]].properties,
      );
    } else {
      const hasData = (flatObject && flatObject[keys[i]]);
      mergedObject[keys[i]] = { // eslint-disable-line
        ...openApiObject[keys[i]],
        value: (hasData ? flatObject[keys[i]] : openApiObject[keys[i]].example),
      };
    }
  }
};

export default {
  sortArrayOfObjects,
  paginateArray,
  objectDeepUpdate,
  openApiObjectToFlatObject,
  mergeFlatObjectIntoOpenApiObject,
};
