function isFundingVisible(card) {
  const form = card?.product_form?.id || card?.productFormId || card?.productForm || "";
  return !card?.hidden && !["robotic_system", "机器人系统"].includes(form);
}
module.exports = { isFundingVisible };
