export const mergeArrays = (...arrays) => {
  arrays = arrays.filter(a => a !== undefined);
  return Array.from(new Set([].concat(...arrays)));
};

export const mergeObjects = (obj1, obj2) => {
  const result = {};
  const keys = mergeArrays(Object.keys(obj1), Object.keys(obj2));
  keys.forEach(key => {
    result[key] = Object.assign({}, obj1[key], obj2[key]);
  });
  return result;
};

export const capitalize = (s = ' ') => s[0].toUpperCase() + s.slice(1);

export const titleCase = (s = ' ') => s[0].toUpperCase() + s.slice(1).toLowerCase();

export const upperCaseUnderscore = (s = ' ') => 
  s.replace(/([A-Z])/g, ' $1').split(' ').join('_').toUpperCase();

export const upperCaseUnderScoreToCamel = (s = ' ') =>
  s.split('_').map((w, i) => i === 0 ? w.toLowerCase() : titleCase(w)).join('')