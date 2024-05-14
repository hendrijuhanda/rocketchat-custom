import type { ReactNode } from 'react';
import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { createAnchor } from '../lib/utils/createAnchor';
import { deleteAnchor } from '../lib/utils/deleteAnchor';

type TooltipPortalProps = {
	children: ReactNode;
};

const TooltipPortal = ({ children }: TooltipPortalProps) => {
	const [tooltipRoot, setTooltipRoot] = useState<HTMLElement>();

	useEffect(() => {
		const tooltipRoot = createAnchor('tooltip-root');
		setTooltipRoot(tooltipRoot);

		return () => deleteAnchor(tooltipRoot);
	}, []);

	if (!tooltipRoot) return null;

	return createPortal(children, tooltipRoot);
};

export default memo(TooltipPortal);
