import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library, findIconDefinition, IconName } from '@fortawesome/fontawesome-svg-core';
import useNotifications from '../hooks/useNotifications';
import { useAppDispatch } from '../redux/config/store';
import { removeNotification } from '../redux/notifications';
import { raw } from '../utils/textUtils';
import { useNavigate } from 'react-router-dom';
import { far } from '@fortawesome/pro-regular-svg-icons';

library.add(far);

const durations = { appear:8000, enter:8000, exit: 300 };
const stayOnScreen = 15 * 1000;
// const stayOnScreen = 1000 * 1000;

function Notifications() {
	const node = useRef<HTMLDivElement>(null);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const notification = useNotifications();

	const [showNotification, setShowNotification] = useState(Boolean(notification));

	const onClose = useCallback(() => {
		setShowNotification(false);
		setTimeout(() => {
			if (notification) {
				dispatch(removeNotification(notification.id));
			}
		}, durations.exit);
	}, [notification]);

	const onClick = useCallback(() => {
		if (notification?.link) {
			navigate(notification.link);
		}
		onClose();
	}, [notification]);

	useEffect(() => {
		setShowNotification(Boolean(notification));

		const to = setTimeout(() => {
			onClose();
		}, stayOnScreen);

		return () => {
			clearTimeout(to);
		};
	}, [notification]);

	return (
		<CSSTransition nodeRef={node} key={notification?.id} timeout={durations} mountOnEnter unmountOnExit in={notification && showNotification} appear>
			<div className="notification" ref={node} onClick={onClick}>
				<div className="glow"></div>
				<div className="translate">
					<div className="scale">
						<div className="notification-icon">
							<FontAwesomeIcon icon={findIconDefinition({ prefix: 'far', iconName: (notification?.icon || 'bell-exclamation') as IconName })} />
						</div>
						<div className="notification-content">
							<div className="notification-text">
								{notification?.title && <div className="title" {...raw(notification?.title)} />}
								{notification?.message && <div className="text" {...raw(notification?.message)} />}
							</div>
						</div>
					</div>
				</div>
			</div>
		</CSSTransition>
	);
}

export default memo(Notifications);