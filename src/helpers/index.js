/* eslint-disable */
// const getNestedObject = (o, p) => p.split('.').reduce((xs, x) => (xs && xs[x]) ? xs[x] : undefined, o);
const getNestedObject = (nestedObj, path) => {
  return path.split('.').reduce((obj, key) =>
    (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
  // return path.split('.').reduce((prev, curr) => {
  //   return prev ? prev[curr] : undefined;
  // }, nestedObj || this );
};

const sortArrayOfObjects = ({ array, sortByKey, sortByKeyType, sortDirection = 'desc' }) => {
  if (sortByKeyType === 'string') {
    const arr = array.sort((a, b) => {
      if (getNestedObject(a, sortByKey).toLowerCase() < getNestedObject(b, sortByKey).toLowerCase()) {
        return -1;
      } else if (getNestedObject(a, sortByKey).toLowerCase() > getNestedObject(b, sortByKey).toLowerCase()) {
        return 1;
      }
      return 0;
    });
    return (sortDirection === 'desc' ? arr : arr.reverse());
  } else if (sortByKeyType === 'number' || sortByKeyType === 'boolean') {
    const arr = array.sort((a, b) => (getNestedObject(a, sortByKey) - getNestedObject(b, sortByKey)));
    // const arr = array.sort((a, b) => (a[sortByKey] - b[sortByKey]));
    return (sortDirection === 'desc' ? arr : arr.reverse());
  }
  return array;
};

/* const sortArrayOfObjects = ({ array, sortByKey, sortByKeyType, sortDirection = 'desc' }) => {
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
  } else if (sortByKeyType === 'number' || sortByKeyType === 'boolean') {
    const arr = array.sort((a, b) => (a[sortByKey] - b[sortByKey]));
    return (sortDirection === 'desc' ? arr : arr.reverse());
  }
  return array;
}; */

const paginateArray = ({ array, itemsPerPage, page }) => {
  const totalItems = array.length;
  const startIndex = (itemsPerPage * (page - 1));
  const endIndex = (startIndex + itemsPerPage);
  return array.slice(startIndex, (endIndex <= totalItems ? endIndex : totalItems));
};

const objectDeepUpdate = (propPath, value, object, customAction) => {
  if (propPath.length > 1) {
    if (object[propPath[0]] === undefined) {
      object[propPath[0]] = {}; // eslint-disable-line
    }
    if (propPath.length === 2 && customAction === 'deleteLastItem') {
      delete object[propPath[0]][propPath[1]];
      return true;
    }
    return objectDeepUpdate(propPath.slice(1), value, object[propPath[0]], customAction);
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
