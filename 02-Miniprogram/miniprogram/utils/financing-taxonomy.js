const taxonomy = require('../data/financing-taxonomy.js');
const sectors = new Map(taxonomy.sectors.map(sector => [`subcategory:${sector.id}`, sector]));

function currentFinancingIndex(index) {
  return index?.meta?.taxonomyVersion === taxonomy.version && Array.isArray(index.cards) && index.cards.every(card => {
    const sector = sectors.get(card.categoryId);
    return sector && card.subcategory === sector.name && card.parentCategoryId === sector.parentId && card.parentCategory === sector.parentName;
  });
}
module.exports = { currentFinancingIndex, taxonomyVersion: taxonomy.version };
