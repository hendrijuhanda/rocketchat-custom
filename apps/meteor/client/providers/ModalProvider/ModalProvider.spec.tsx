import { Emitter } from '@rocket.chat/emitter';
import { useSetModal } from '@rocket.chat/ui-contexts';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import React, { act, Suspense, createContext, useContext, useEffect } from 'react';

import GenericModal from '../../components/GenericModal';
import { imperativeModal } from '../../lib/imperativeModal';
import ModalRegion from '../../views/modal/ModalRegion';
import ModalProvider from './ModalProvider';
import ModalProviderWithRegion from './ModalProviderWithRegion';

const TestContext = createContext({ title: 'default' });
const emitter = new Emitter();

const TestModal = ({ emitterEvent, modalFunc }: { emitterEvent: string; modalFunc?: ReactNode }) => {
	const setModal = useSetModal();
	const { title } = useContext(TestContext);

	useEffect(
		() =>
			emitter.on(emitterEvent, () => {
				setModal(modalFunc || <GenericModal title={title} onClose={() => undefined} />);
			}),
		[emitterEvent, setModal, title, modalFunc],
	);

	return null;
};

describe('Modal Provider', () => {
	it('should render a modal', async () => {
		render(
			<Suspense fallback={null}>
				<ModalProviderWithRegion>
					<TestModal emitterEvent='open' />
				</ModalProviderWithRegion>
			</Suspense>,
		);

		act(() => emitter.emit('open'));

		expect(await screen.findByText('default')).toBeInTheDocument();
	});

	it('should render a modal that is passed as a function', async () => {
		render(
			<Suspense fallback={null}>
				<ModalProviderWithRegion>
					<TestModal emitterEvent='open' modalFunc={<GenericModal title='function modal' onClose={() => undefined} />} />
				</ModalProviderWithRegion>
			</Suspense>,
		);

		act(() => emitter.emit('open'));

		expect(await screen.findByText('function modal')).toBeInTheDocument();
	});

	it('should render a modal through imperative modal', () => {
		async () => {
			render(
				<Suspense fallback={null}>
					<ModalProvider>
						<ModalRegion />
					</ModalProvider>
				</Suspense>,
			);

			const { close } = imperativeModal.open({
				component: GenericModal,
				props: { title: 'imperativeModal' },
			});

			expect(await screen.findByText('imperativeModal')).toBeInTheDocument();

			close();

			expect(screen.queryByText('imperativeModal')).not.toBeInTheDocument();
		};
	});

	it('should not render a modal if no corresponding region exists', async () => {
		// ModalProviderWithRegion will always have a region identifier set
		// and imperativeModal will only render modals in the default region (e.g no region identifier)
		render(
			<Suspense fallback={null}>
				<ModalProviderWithRegion />
			</Suspense>,
		);

		act(() =>
			imperativeModal.open({
				component: GenericModal,
				props: { title: 'imperativeModal' },
			}),
		);

		expect(screen.queryByText('imperativeModal')).not.toBeInTheDocument();
	});

	it('should render a modal in another region', async () => {
		render(
			<TestContext.Provider value={{ title: 'modal1' }}>
				<Suspense fallback={null}>
					<ModalProviderWithRegion>
						<TestModal emitterEvent='openModal1' />
					</ModalProviderWithRegion>
				</Suspense>
				<TestContext.Provider value={{ title: 'modal2' }}>
					<Suspense fallback={null}>
						<ModalProviderWithRegion>
							<TestModal emitterEvent='openModal2' />
						</ModalProviderWithRegion>
					</Suspense>
				</TestContext.Provider>
			</TestContext.Provider>,
		);

		await act(async () => emitter.emit('openModal1'));
		await expect(screen.findByText('modal1')).resolves.toBeInTheDocument();
		await act(async () => emitter.emit('openModal2'));
		await expect(screen.findByText('modal2')).resolves.toBeInTheDocument();
	});
});
