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

import Icon from "./Icon";


export function Card({ className = "", ...props }: React.ComponentProps<typeof HeroCard> ) {
    return <HeroCard className={clsx("p-2 rounded-xl",className)} {...props} />
}

type CardHeaderProps = {
    className?: string;
    onEdit?: () => void;
    onDelete?: () => void;
    onRefresh?: () => void;
    spinner?: boolean,
    children?: React.ReactNode;
} & React.ComponentProps<typeof HeroCardHeader>;

export function CardHeader({ className = "", onEdit, onDelete, onRefresh, spinner = false, children, ...props }: CardHeaderProps ) {
    const refreshSpinner = spinner ? <Spinner size="sm" color="default" /> 
        : ( Boolean(onRefresh) ? <Icon src={refreshIcon} onClick={onRefresh} /> : null );

    return (
        <HeroCardHeader className={clsx("relative p-2 font-bold rounded-xl",className)} {...props}>
            <div className="absolute flex top-3 right-3 gap-3">
                { Boolean(onEdit) && <Icon src={editIcon} onClick={onEdit} /> }
                { refreshSpinner }
                { Boolean(onDelete) && <Icon src={deleteIcon} onClick={onDelete} /> }
            </div>
            {children}
        </HeroCardHeader>
    )
}

export function CardBody({ className = "", ...props }: any ) {
    return <HeroCardBody className={clsx("p-2 rounded-xl",className)} {...props} />
}
