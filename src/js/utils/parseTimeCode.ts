// This file contains the logic needed to read timed metadata using
// video.js. Every player has its own way of reading these transports.
export const onPlayerTimecodeOrigin = (player, callback) => {
	player.textTracks().addEventListener(
		'addtrack',
		(addTrackEvent) => {
			const track = addTrackEvent.track;

			track.addEventListener(
				'cuechange',
				() => {
					callback(Math.round(player.currentTime() * 1000));
				},
				false,
			);
		},
		false,
	);
};

// This file contains the logic needed to read timed metadata using
// video.js. Every player has its own way of reading these transports.
export const onPlayerTimecode = (player, callback) => {
	let hasId3Timecode = false;
	player.textTracks().addEventListener(
		'addtrack',
		(addTrackEvent) => {
			const track = addTrackEvent.track;

			track.addEventListener(
				'cuechange',
				function (cueChangeEvent) {
					if (track.activeCues.length <= 0) {
						return;
					}

					for (let cueIdx = 0; cueIdx < track.activeCues.length; cueIdx++) {
						const cue = track.activeCues[cueIdx];
						let time;
						if (!hasId3Timecode && cue.value.dateTimeObject) {
							// timecode from EXT-X-PROGRAM-DATE-TIME
							time = cue.value.dateTimeObject.getTime();
							callback(time);
						} else if (cue.value.data) {
							// timecode from timed ID3 metadata

							try {
								let data = null;
								if (typeof cue.value.data === 'string') {
									data = cue.value.data;
								} else if (cue.value.data.constructor === Uint8Array) {
									data = new TextDecoder().decode(cue.value.data);
								}

								if (!data || data.length === 0) {
									return;
								}

								data = data.substring(
									data.indexOf('{'),
									1 + data.lastIndexOf('}'),
								);

								const json = JSON.parse(data);
								time = parseInt(json.ut || json.utc, 10);

								if (!isNaN(time)) {
									hasId3Timecode = true;
									callback(time);
								}
							} catch (e) {
								console.error('error parsing timecode', e);
							}
						}
					}
				},
				false,
			);
		},
		false,
	);
};
