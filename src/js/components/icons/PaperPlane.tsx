import React from 'react';

export default function PaperPlane() {
	return (
		<svg className="paper-plane-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 47">
			<defs>
				<filter id="a" x="0" y="0" width="44" height="47" filterUnits="userSpaceOnUse">
					<feOffset dy="3" />
					<feGaussianBlur stdDeviation="4" result="blur" />
					<feFlood floodOpacity=".2" />
					<feComposite operator="in" in2="blur" />
					<feComposite in="SourceGraphic" />
				</filter>
				<filter id="b" x="6" y="11" width="32" height="16.5" filterUnits="userSpaceOnUse">
					<feOffset dy="1" />
					<feGaussianBlur stdDeviation="2" result="blur-2" />
					<feFlood floodOpacity=".2" />
					<feComposite operator="in" in2="blur-2" />
					<feComposite in="SourceGraphic" />
				</filter>
				<filter id="c" x="6" y="15.5" width="32" height="23.5" filterUnits="userSpaceOnUse">
					<feOffset dy="1" />
					<feGaussianBlur stdDeviation="2" result="blur-3" />
					<feFlood floodOpacity=".2" />
					<feComposite operator="in" in2="blur-3" />
					<feComposite in="SourceGraphic" />
				</filter>
			</defs>
			<g opacity=".79">
				<g>
					<g filter="url(#a)">
						<path d="M32 32 12 20.5 32 9l-2.5 8.05L32 20.5l-2.5 3.45Z" fill="rgba(255,255,255,0.8)" />
					</g>
					<g filter="url(#b)">
						<path d="M29.5 16 12 20.5h20Z" fill="rgba(255,255,255,0.8)" />
					</g>
					<g filter="url(#c)">
						<path d="M12 20.5 32 32l-2.5-8.05Z" fill="rgba(255,255,255,0.8)" />
					</g>
				</g>
			</g>
		</svg>
	);
}