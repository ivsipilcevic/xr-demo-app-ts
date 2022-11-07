/**
 * Check if the viewport width is smaller or equal to a treshold
 */
export const isMobile = (threshold = 1279) => window.matchMedia(`(max-width: ${threshold}px)`).matches;