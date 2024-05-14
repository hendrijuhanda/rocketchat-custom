import { TextInput } from '@rocket.chat/fuselage';
import { useEffectEvent, useDebouncedValue } from '@rocket.chat/fuselage-hooks';
import { useTranslation } from '@rocket.chat/ui-contexts';
import type { ReactElement } from 'react';
import React, { useState, useEffect } from 'react';

const PermissionsTableFilter = ({ onChange }: { onChange: (debouncedFilter: string) => void }): ReactElement => {
	const t = useTranslation();
	const [filter, setFilter] = useState('');
	const debouncedFilter = useDebouncedValue(filter, 500);

	useEffect(() => {
		onChange(debouncedFilter);
	}, [debouncedFilter, onChange]);

	const handleFilter = useEffectEvent(({ currentTarget: { value } }) => {
		setFilter(value);
	});

	return (
		<TextInput
			data-qa='PermissionTable-PermissionsTableFilter'
			value={filter}
			onChange={handleFilter}
			placeholder={t('Search')}
			flexGrow={0}
		/>
	);
};

export default PermissionsTableFilter;
