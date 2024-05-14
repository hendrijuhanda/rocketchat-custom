import { useEffectEvent } from '@rocket.chat/fuselage-hooks';

import type { GenericMenuItemProps } from '../GenericMenuItem';

export const useHandleMenuAction = (items: GenericMenuItemProps[], close?: () => void) => {
	return useEffectEvent((id) => {
		const item = items.find((item) => item.id === id && !!item.onClick);
		if (item) {
			item.onClick?.();
			close?.();
		}
	});
};
