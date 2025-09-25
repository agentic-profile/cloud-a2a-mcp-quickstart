import React from 'react';
import externalLinkIcon from "@iconify-icons/lucide/external-link";
import { LabelValue } from './LabelValue';
import { webDidToUrl } from "@agentic-profile/common";
import Icon from './Icon';

interface LabelDidProps {
    label: string;
    did: string | undefined;
    placeholder?: string;
    className?: string;
}

export const LabelDid: React.FC<LabelDidProps> = ({ label, did, placeholder, className = '' }) => {
    return (
        <LabelValue 
            label={label} 
            value={did}
            placeholder={placeholder}
            className={className}
        >
            { !!did && <Icon
                src={externalLinkIcon}
                onClick={() => window.open(webDidToUrl(did), '_blank')}
                className="inline-block ml-1"
            />}
        </LabelValue>
    );
};
