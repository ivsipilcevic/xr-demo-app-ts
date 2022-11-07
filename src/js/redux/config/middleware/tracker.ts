const dictionary = {};

function sum(a) {
	return a.reduce((c, v) => c + v, 0);
}

function average(a) {
	return sum(a) / a.length;
}

const tracker = (/*store*/) => next => action => {
	const timestamp = Date.now();

	if (!dictionary[action.type]) {
		dictionary[action.type] = {
			last: timestamp,
			avgCallMs: 0,
			maxCallMs: 0,
			calls: [],
			callDurations: [],
			errors: [],
		};
	}

	const delta = timestamp - dictionary[action.type].last;

	dictionary[action.type].calls.push(delta);
	
	let index = action.type.indexOf('fulfilled');
	if (index === -1) {
		index = action.type.indexOf('rejected');
	}
	if (index >= 0) {
		const a = action.type.substring(0, index) + 'pending';
		const dur = timestamp - dictionary[a].last;
		dictionary[action.type].callDurations.push(dur);
		dictionary[action.type].avgCallMs = average(dictionary[action.type].callDurations);
	
		if (dictionary[action.type].maxCallMs < dur) {
			dictionary[action.type].maxCallMs = dur;
		}
	}

	dictionary[action.type].last = timestamp;

	if (action.type.indexOf('rejected') >= 0) {
		dictionary[action.type].errors.push(action);
	}

	return next(action);
};

export const debugTracker = () => {
	return Object.keys(dictionary).reduce((c, v) => {
		if (v.indexOf('pending') === -1) {
			const o = {
				...dictionary[v],
				last: (new Date(dictionary[v].last)).toString(),
				count: dictionary[v].calls.length,
			};

			delete o.calls;
			c[v] = o;
		}
		return c;
	}, {});
};

export const filterActions = (filters:string[], secondFilters:string[] = []) => {
	return Object.keys(dictionary)
		.filter(action => !filters || filters.filter(filter => action.indexOf(filter) >= 0).length >= 1)
		.filter(action => !secondFilters || secondFilters.filter(filter => action.indexOf(filter) >= 0).length >= 1)
		.filter(action => action.indexOf('pending') === -1);
};

export const numberOfCalls = (filters:string[], secondFilters:string[] = []) => {
	return sum(
		filterActions(filters, secondFilters).map(action => dictionary[action].calls.length),
	);
};

export const averageMsCalls = (filters:string[], secondFilters:string[] = []) => {
	return average(
		filterActions(filters, secondFilters).map(action => dictionary[action].avgCallMs),
	);
};

export const maxMsCalls = (filters:string[], secondFilters:string[] = []) => {
	return Math.max.apply(null, filterActions(filters, secondFilters)
		.map(action => dictionary[action].maxCallMs));
};

export default tracker;
