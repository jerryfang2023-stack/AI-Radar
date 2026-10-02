const reviewedNames = require('../data/company-display-names.js');
// Presentation only: never change canonical company names, keys or request IDs.
function companyDisplayName(name, market) {
  const value=String(name || '').trim();
  return market === 'global' ? value : reviewedNames[value] || value;
}
module.exports = { companyDisplayName };
