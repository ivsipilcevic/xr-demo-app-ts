import React from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import { ROUTES } from '../Constants';

function Nav() {
	const isLogin = useMatch(ROUTES.ROOT + ROUTES.LOGIN);
	const isHighlightMatch = useMatch(ROUTES.ROOT + ROUTES.HIGHLIGHT_MATCH);
	const isMatch = useMatch(ROUTES.ROOT + ROUTES.MATCH);

	const isHidden = isHighlightMatch || isMatch || isLogin;
	
	return (
		<nav className={`main-nav ${isHidden ? 'hidden' : ''}`}>
			<ul className="menu">
				<li className="menu-item"><NavLink to={ROUTES.ROOT}>Home</NavLink></li>
			</ul>
		</nav>
	);
}

export default Nav;