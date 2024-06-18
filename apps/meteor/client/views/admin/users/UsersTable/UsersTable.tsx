import type { IAdminUserTabs, Serialized } from '@rocket.chat/core-typings';
import { Pagination, States, StatesAction, StatesActions, StatesIcon, StatesTitle } from '@rocket.chat/fuselage';
import { useMediaQuery, useEffectEvent } from '@rocket.chat/fuselage-hooks';
import type { PaginatedResult, DefaultUserInfo } from '@rocket.chat/rest-typings';
import { useRouter, useTranslation } from '@rocket.chat/ui-contexts';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactElement, Dispatch, SetStateAction } from 'react';
import React, { useCallback, useMemo } from 'react';

import FilterByText from '../../../../components/FilterByText';
import GenericNoResults from '../../../../components/GenericNoResults';
import {
	GenericTable,
	GenericTableHeader,
	GenericTableHeaderCell,
	GenericTableBody,
	GenericTableLoadingTable,
} from '../../../../components/GenericTable';
import type { usePagination } from '../../../../components/GenericTable/hooks/usePagination';
import type { useSort } from '../../../../components/GenericTable/hooks/useSort';
import type { UsersFilters, UsersTableSortingOptions } from '../AdminUsersPage';
import UsersTableRow from './UsersTableRow';

type UsersTableProps = {
	tab: IAdminUserTabs;
	onReload: () => void;
	setUserFilters: Dispatch<SetStateAction<UsersFilters>>;
	filteredUsersQueryResult: UseQueryResult<PaginatedResult<{ users: Serialized<DefaultUserInfo>[] }>>;
	paginationData: ReturnType<typeof usePagination>;
	sortData: ReturnType<typeof useSort<UsersTableSortingOptions>>;
};

// TODO: Missing error state
const UsersTable = ({
	filteredUsersQueryResult,
	setUserFilters,
	tab,
	onReload,
	paginationData,
	sortData,
}: UsersTableProps): ReactElement | null => {
	const t = useTranslation();
	const router = useRouter();
	const mediaQuery = useMediaQuery('(min-width: 1024px)');

	const { data, isLoading, isError, isSuccess } = filteredUsersQueryResult;

	const { current, itemsPerPage, setItemsPerPage, setCurrent, ...paginationProps } = paginationData;
	const { sortBy, sortDirection, setSort } = sortData;

	const isKeyboardEvent = (
		event: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>,
	): event is React.KeyboardEvent<HTMLElement> => {
		return (event as React.KeyboardEvent<HTMLElement>).key !== undefined;
	};

	const handleClickOrKeyDown = useEffectEvent(
		(id, e: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>): void => {
			e.stopPropagation();

			const keyboardSubmitKeys = ['Enter', ' '];

			if (isKeyboardEvent(e) && !keyboardSubmitKeys.includes(e.key)) {
				return;
			}

			router.navigate({
				name: 'admin-users',
				params: {
					context: 'info',
					id,
				},
			});
		},
	);

	const headers = useMemo(
		() => [
			<GenericTableHeaderCell w='x240' key='name' direction={sortDirection} active={sortBy === 'name'} onClick={setSort} sort='name'>
				{t('Name')}
			</GenericTableHeaderCell>,
			mediaQuery && (
				<GenericTableHeaderCell
					w='x140'
					key='username'
					direction={sortDirection}
					active={sortBy === 'username'}
					onClick={setSort}
					sort='username'
				>
					{t('Username')}
				</GenericTableHeaderCell>
			),
			mediaQuery && (
				<GenericTableHeaderCell
					w='x120'
					key='email'
					direction={sortDirection}
					active={sortBy === 'emails.address'}
					onClick={setSort}
					sort='emails.address'
				>
					{t('Email')}
				</GenericTableHeaderCell>
			),
			mediaQuery && (
				<GenericTableHeaderCell w='x120' key='roles'>
					{t('Roles')}
				</GenericTableHeaderCell>
			),
			tab === 'all' && (
				<GenericTableHeaderCell w='x100' key='status'>
					{t('Registration_status')}
				</GenericTableHeaderCell>
			),
		],
		[mediaQuery, setSort, sortBy, sortDirection, t, tab],
	);

	const handleSearchTextChange = useCallback(
		({ text }) => {
			setUserFilters({ text });
		},
		[setUserFilters],
	);
	return (
		<>
			<FilterByText shouldAutoFocus placeholder={t('Search_Users')} onChange={handleSearchTextChange} />
			{isLoading && (
				<GenericTable>
					<GenericTableHeader>{headers}</GenericTableHeader>
					<GenericTableBody>
						<GenericTableLoadingTable headerCells={5} />
					</GenericTableBody>
				</GenericTable>
			)}

			{isError && (
				<States>
					<StatesIcon name='warning' variation='danger' />
					<StatesTitle>{t('Something_went_wrong')}</StatesTitle>
					<StatesActions>
						<StatesAction onClick={onReload}>{t('Reload_page')}</StatesAction>
					</StatesActions>
				</States>
			)}

			{isSuccess && data.users.length === 0 && <GenericNoResults />}

			{isSuccess && !!data?.users && (
				<>
					<GenericTable>
						<GenericTableHeader>{headers}</GenericTableHeader>
						<GenericTableBody>
							{data.users.map((user) => (
								<UsersTableRow key={user._id} onClick={handleClickOrKeyDown} mediaQuery={mediaQuery} user={user} tab={tab} />
							))}
						</GenericTableBody>
					</GenericTable>
					<Pagination
						divider
						current={current}
						itemsPerPage={itemsPerPage}
						count={data?.total || 0}
						onSetItemsPerPage={setItemsPerPage}
						onSetCurrent={setCurrent}
						{...paginationProps}
					/>
				</>
			)}
		</>
	);
};

export default UsersTable;
