import { createSelector } from '@reduxjs/toolkit';
import { IRootState } from '../redux/config/store';
import first from '../utils/first';

export const statsSelector = (state:IRootState) => state.statistics;
const titleDataStateSelector = (state:IRootState) => state.title_data;

export const xpSelector = createSelector([
	statsSelector,
], (stats) => {
	return stats?.xp ?? 0;
});

export const levelThresholdSelector = createSelector([
	statsSelector,
	titleDataStateSelector,
], (stats, titleData) => {
	if (!titleData.xp_levels) return 0;

	return first(titleData.xp_levels.filter(xpNeeded => xpNeeded > (stats.xp || 0))) || 99999;
});

export const currentLevelThresholdSelector = createSelector([
	statsSelector,
	titleDataStateSelector,
], (stats, titleData) => {
	if (!titleData.xp_levels) return 0;

	
	if (stats.level <= 1) return 0;
	return titleData.xp_levels[stats.level - 2];
});
