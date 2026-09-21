/**
 * Formats a score percentage with styling helpers
 * @param {number} score
 * @param {number} threshold
 * @returns {object}
 */
export const formatScore = (score, threshold = 75) => {
  const numericScore = typeof score === 'number' ? Math.round(score) : 0;
  const isPassed = numericScore >= threshold;

  return {
    percentage: `${numericScore}%`,
    raw: numericScore,
    isPassed,
    badgeColor: isPassed
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-red-50 text-red-700 border-red-200',
    textColor: isPassed ? 'text-emerald-600' : 'text-red-600',
  };
};
