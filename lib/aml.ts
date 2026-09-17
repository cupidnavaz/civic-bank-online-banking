export function screenBeneficiary(recipientName: string, routingCode: string): { riskScore: number; status: "CLEARED" | "FLAGGED_FOR_REVIEW" } {
  const highRiskKeywords = ["SANCTION", "BLOCK", "OFFSHORE_SHELL", "HIGH_RISK_JURISDICTION"];
  const upperName = recipientName.toUpperCase();

  const isMatched = highRiskKeywords.some((keyword) => upperName.includes(keyword));

  if (isMatched || routingCode.startsWith("X99")) {
    return { riskScore: 88, status: "FLAGGED_FOR_REVIEW" };
  }

  return { riskScore: 2, status: "CLEARED" };
}