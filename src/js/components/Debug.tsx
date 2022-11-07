import React, { useEffect, useState } from 'react';
import { APP_VERSION } from '../Constants';

import usePlayFab from '../hooks/usePlayFab';
import { averageMsCalls, debugTracker, maxMsCalls, numberOfCalls } from '../redux/config/middleware/tracker';

const START = new Date().toISOString();
const START_TS = Date.now();

function Debug() {
	const [visible, setVisible] = useState(false);
	const [mins, setMins] = useState(0);

	const { playerId: playfabId } = usePlayFab();

	const defaultState = {
		total: 0,
		rejected: 0,
		average: 0,
		max: 0,
	};

	const [playfabXRCalls, setPlayfabXrCalls] = useState({ ...defaultState });
	const [playfabCalls, setPlayfabCalls] = useState({ ...defaultState });
	const [realtimeCalls, setRealtimeCalls] = useState({ ...defaultState });

	let interval:number | null = null;

	function onClick() {
		const textarea = document.createElement('textarea');
		textarea.textContent = JSON.stringify(debugTracker(), null, 4);
		textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
		document.body.appendChild(textarea);
		textarea.select();
		try {
			return document.execCommand('copy'); // Security exception may be thrown by some browsers.
		} catch (ex) {
			console.warn('Copy to clipboard failed.', ex);
			return false;
		} finally {
			document.body.removeChild(textarea);
		}
	}

	function update() {
		const nowTs = Date.now();
		const diff = Math.floor((nowTs - START_TS) / 1000 / 60);

		setMins(diff);
		setPlayfabXrCalls({
			total: Math.round(numberOfCalls(['playfab-xr'])),
			rejected: Math.round(numberOfCalls(['playfab-xr'], ['rejected'])),
			average: Math.round(averageMsCalls(['playfab-xr'], ['rejected', 'fulfilled'])),
			max: Math.round(maxMsCalls(['playfab-xr'])),
		});
		setPlayfabCalls({
			total: Math.round(numberOfCalls(['playfab'])),
			rejected: Math.round(numberOfCalls(['playfab'], ['rejected'])),
			average: Math.round(averageMsCalls(['playfab'], ['rejected', 'fulfilled'])),
			max: Math.round(maxMsCalls(['playfab'])),
		});
		setRealtimeCalls({
			total: Math.round(numberOfCalls(['realtime'])),
			rejected: Math.round(numberOfCalls(['realtime'], ['rejected'])),
			average: Math.round(averageMsCalls(['realtime'], ['rejected', 'fulfilled'])),
			max: Math.round(maxMsCalls(['realtime'])),
		});
	}
	
	function onMouseEnter() {
		interval = window.setInterval(update, 500);
		update();
	}

	function stopInterval() {
		if (interval) clearInterval(interval);
		interval = null;
	}

	function onMouseLeave() {
		stopInterval();
	}

	function onKeyDown(e:KeyboardEvent) {
		if (e.keyCode === 68 && e.altKey) {
			setVisible(true);
		}
	}

	useEffect(() => {
		document.addEventListener('keydown', onKeyDown);
		stopInterval();
		
		return () => {
			document.removeEventListener('keydown', onKeyDown);
			stopInterval();
		};
	}, []);

	const calls = [
		{ name: 'PlayFab XR', calls: playfabXRCalls },
		{ name: 'PlayFab', calls: playfabCalls },
		{ name: 'Realtime', calls: realtimeCalls },
	];

	return visible && (
		<div className="debug-overlay" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			<div>{`PlayFab ID: ${playfabId}`}</div>
			<div>{`App Version: ${APP_VERSION}`}</div>
			<br />
			<div>{`Page opened since: ${START}`}</div>
			<div>{`Running since ${mins} minute${mins > 1 ? 's' : ''}`}</div>
			<br />
			<table>
				<tbody>
					<tr>
						<th />
						<td>CPM</td>
						<td><span role="img" aria-label="up">calls</span></td>
						<td><span role="img" aria-label="exclamation">errors</span></td>
						<td>avg ms</td>
						<td>max ms</td>
					</tr>
					{
						calls.map(({ name, calls: c }) => {
							return (
								<tr key={name}>
									<th>{name}</th>
									<td>{Math.round(c.total / (mins || 1))}</td>
									<td>{c.total || 0}</td>
									<td>{c.rejected || 0}</td>
									<td>{c.average || 0}</td>
									<td>{c.max || 0}</td>
								</tr>
							);
						})
					}
				</tbody>
			</table>
			<div className="debug-calls" role="button" onClick={onClick} onKeyPress={onClick} tabIndex={-1}>Copy Debug Calls</div>
		</div>
	);
}

export default Debug;
