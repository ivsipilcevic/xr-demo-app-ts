import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ITEM_CLASSES } from '../Constants';
import { IRootState } from '../redux/config/store';

export default function useBadges() {
	const inventory = useSelector((state:IRootState) => state.inventory);
	const catalog = useSelector((state:IRootState) => state.catalog.items);

	const catalogBadges = catalog.filter(item => item.playfab.ItemClass === ITEM_CLASSES.BADGE);
	const badges = inventory.filter(item => item.playfab.ItemClass === ITEM_CLASSES.BADGE);

	return useMemo(() => {
		const arr = catalogBadges.map(badge => {
			const foundBadge = badges.find(x => {
				return x.itemId === badge.itemId;
			});
			const inventoryBadge = foundBadge || { playfab:{} };
			return {
				...badge,
				playfab: {
					...badge.playfab,
					...inventoryBadge.playfab,
				},
				isInInventory: Boolean(foundBadge),
			};
		}) as Badge[];

		return arr;
	}, [catalogBadges, badges]);
}