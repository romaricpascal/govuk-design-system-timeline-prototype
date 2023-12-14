module.exports = {
  /**
   * Indexes objects of the given list according to the given property
   * @template {Object} Item
   * @param {Item[]} list 
   * @param {{by: string}} options
   * @returns {{string: Item[]}} An object whose keys are the unique values for the given property, and values arrays of each of the items for which property has that specific value
   */
  index(list, {by:getter}) {
    const index = {};

    if (typeof getter === 'string') {
      const propertyName = getter;
      getter = item => item[propertyName]
    }

    list.forEach(item => {

      const value = item[getter];

      if (!index[value]) {
        index[value] = []
      }

      index[value].push(item)
    })
    
    return index;
  },
  // Comparator for sorting an array by ascending order of the given property
  ascending(propertyName) {
    return (a,b) => a[propertyName] > b[propertyName] ? 1 : a[propertyName] < b[propertyName] ? -1 : 0
  }
}
