import React, { MouseEventHandler } from 'react';
import { NavLink } from 'react-router-dom';
import Arrow from '../icons/Arrow';

type ButtonProps = {
	onClick?:MouseEventHandler,
	label:string,
	to?:string,
	url?:string,
	isBlank?:boolean,
	className?:string,
	disabled?:boolean,
	hasArrow?:boolean,
};

function Button({ className = '', onClick, label, to, url, isBlank, disabled = false, hasArrow = false }:ButtonProps) {
	const props = {
		className: 'button' + (hasArrow ? '-arrow' : '') + (className ? ' ' + className : '') + (disabled ? ' disabled' : ''),
		onClick: null,
		disabled: false,
	} as Record<string, any>;

	if (onClick) {
		props.onClick = onClick;
	}

	if (url) {
		props.href = url;
		
		if (isBlank) props.target = '_blank';
	} else {
		if (disabled) props.disabled = true;
	}

	const icon = hasArrow ? (
		<Arrow />
	) : null;

	if (to) return <NavLink to={to} {...props}>{label} {icon}</NavLink>;
	if (url) return <a {...props}>{label} {icon}</a>;
	return <button {...props}>{label} {icon}</button>;
}

export default Button;