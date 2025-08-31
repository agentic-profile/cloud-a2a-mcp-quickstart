import {
    Card as HeroCard,
    CardBody as HeroCardBody,
    CardHeader as HeroCardHeader,
    Spinner
} from "@heroui/react";
import clsx from "clsx";
import editIcon from "@iconify-icons/lucide/pencil";
import deleteIcon from "@iconify-icons/lucide/trash";
import refreshIcon from "@iconify-icons/lucide/rotate-cw";
import closeIcon from "@iconify-icons/lucide/x";

import Icon from "./Icon";


export function Card({ className = "", ...props }: React.ComponentProps<typeof HeroCard> ) {
    const baseClasses = "p-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200";
    return <HeroCard className={clsx(baseClasses,className)} {...props} />
}

type CardHeaderProps = {
    className?: string;
    onEdit?: () => void;
    onDelete?: () => void;
    onRefresh?: () => void;
    onClose?: () => void;
    spinner?: boolean,
    children?: React.ReactNode;
} & React.ComponentProps<typeof HeroCardHeader>;

export function CardHeader({ className = "", onEdit, onDelete, onRefresh, onClose, spinner = false, children, ...props }: CardHeaderProps ) {
    const refreshSpinner = spinner ? <Spinner size="sm" color="default" /> 
        : ( Boolean(onRefresh) ? <Icon src={refreshIcon} onClick={onRefresh} /> : null );

    return (
        <HeroCardHeader className={clsx("relative p-2 font-bold rounded-xl",className)} {...props}>
            <div className="absolute flex top-3 right-3 gap-3">
                { Boolean(onEdit) && <Icon src={editIcon} onClick={onEdit} /> }
                { refreshSpinner }
                { Boolean(onDelete) && <Icon src={deleteIcon} onClick={onDelete} /> }
                { Boolean(onClose) && <Icon src={closeIcon} onClick={onClose} /> }
            </div>
            {children}
        </HeroCardHeader>
    )
}

export function CardBody({ className = "", ...props }: any ) {
    return <HeroCardBody className={clsx("p-2",className)} {...props} />
}
