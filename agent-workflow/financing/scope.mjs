// Scope is determined from the funding subject's original description. A
// customer's robotics use case must not exclude a general AI supplier.
export function financingScope({ title = '', body = '' } = {}) {
  const subject = String(title);
  const opening = String(body).slice(0, 1800);
  // A robotics company mentioned after "serving/for" is a customer, not the
  // funding subject. Keep the subject clause for title-based exclusions.
  const customerClause = subject.search(/\b(?:serves?|serving|for|used by|sold to|customers? (?:include|such as)|clients? (?:include|such as))\b|服务|面向|客户包括/iu);
  const subjectBusiness = customerClause < 0 ? subject : subject.slice(0, customerClause);
  const embodied = /具身智能|人形机器人|humanoid|embodied (?:AI|intelligence)|机器人(?:本体|核心部件|关节|执行器|减速器)|robot(?:ic)? (?:actuator|joint|components?)/iu;
  const roboticsSubject = /(?:robotics?|机器人).{0,30}(?:startup|start-up|company|firm|maker|企业|公司|厂商|融资|获投)|(?:startup|company|maker|企业|公司|专注于|主营).{0,35}(?:robotics|机器人)/iu;
  const consumer = /AI.{0,8}(?:toy|pet|companion)|(?:toy|pet|companion).{0,15}(?:AI|robot)|AI玩具|AI宠物|陪伴(?:设备|玩具|机器人)|消费.{0,8}(?:玩具|陪伴)/iu;
  // A keyword match is a review signal, not a verified core-business finding.
  if (embodied.test(subjectBusiness)) return { included: false, pending: true, reason: 'embodied_or_robotics_core_business_review' };
  if (roboticsSubject.test(subjectBusiness) && !consumer.test(subject)) return { included: false, pending: true, reason: 'robotics_core_business_review' };
  // Only explicit self-description qualifies in the body; incidental market,
  // investor-portfolio and customer examples do not establish core business.
  const sentences = opening.split(/[。\n]|(?<=\.)\s+/u);
  if (sentences.some(sentence => /(?:专注(?:于)?|主营|主要研发|is (?:an? |the )?(?:leading )?|a startup (?:building|developing))[^。\n]{0,55}(?:具身智能|人形机器人|humanoid|embodied intelligence|robotics company|robotics startup|robot actuators)/iu.test(sentence))) {
    return { included: false, pending: true, reason: 'embodied_or_robotics_core_business_review' };
  }
  if (!/人工智能|\bAI\b|artificial intelligence|machine learning|deep learning|大模型|算力|智能眼镜|智能戒指|陪伴机器人|智能玩具/iu.test(`${subject} ${body}`)) return { included: false, reason: 'ai_relevance_unverified', pending: true };
  return { included: true, reason: consumer.test(subject) ? 'consumer_ai_hardware' : 'ai_financing' };
}
