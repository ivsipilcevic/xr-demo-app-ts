import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

export default function Loading({ isLoading = true }:{ isLoading?: boolean }) {
	const loading = useRef<HTMLDivElement>(null);
	
	return (
		<CSSTransition in={isLoading} nodeRef={loading} timeout={300}>
			<div className="loading" ref={loading}>
				Loading...
			</div>
		</CSSTransition>
	);
}