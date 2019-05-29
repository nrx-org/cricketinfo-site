import "array-flat-polyfill";

const isUndefinedOrNull = obj => typeof obj === "undefined" || obj === null;

const isImageObjectShape = obj => {
  if (isUndefinedOrNull(obj)) {
    return false;
  }

  return (
    Object.prototype.hasOwnProperty.call(obj, "url") &&
    Object.prototype.hasOwnProperty.call(obj, "altText") &&
    Object.prototype.hasOwnProperty.call(obj, "license")
  );
};

const recursivelyGetImageAttributions = (obj, collectedAttributions) => {
  // console.log("obj is: ", obj, "collected are: ", collectedAttributions);
  if (Array.isArray(obj)) {
    return collectedAttributions
      .concat(
        obj.map(item => {
          if (isImageObjectShape(item)) {
            // console.log("Correct image shape! Returning!", item);
            return item;
          }

          return recursivelyGetImageAttributions(item, collectedAttributions);
        })
      )
      .flat();
  }

  if (typeof obj === "object" && !isUndefinedOrNull(obj)) {
    return collectedAttributions
      .concat(
        Object.keys(obj).map(key => {
          if (isImageObjectShape(obj[key])) {
            // console.log("Correct image shape! Returning!", obj[key]);
            return obj[key];
          }

          return recursivelyGetImageAttributions(
            obj[key],
            collectedAttributions
          );
        })
      )
      .flat();
  }

  return [];
};

export const getImageAttributions = obj =>
  recursivelyGetImageAttributions(obj, []);
