import type { ReactNode } from 'react';
import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { createAnchor } from '../lib/utils/createAnchor';
import { deleteAnchor } from '../lib/utils/deleteAnchor';

type ModalPortalProps = {
	children?: ReactNode;
};

const ModalPortal = ({ children }: ModalPortalProps) => {
	const [modalRoot, setModalRoot] = useState<HTMLElement>();

	useEffect(() => {
		const modalRoot = createAnchor('modal-root');
		setModalRoot(modalRoot);

		return () => deleteAnchor(modalRoot);
	}, []);

	if (!modalRoot) return null;

	return createPortal(children, modalRoot);
};

export default memo(ModalPortal);
