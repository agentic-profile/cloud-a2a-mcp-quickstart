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
import clearIcon from "@iconify-icons/lucide/eraser";

import Icon from "./Icon";


type CardVariant = "default" | "success" | "error";

type CardProps = React.ComponentProps<typeof HeroCard> & {
    variant?: CardVariant;
};

export function Card({ className = "", variant = "default", ...props }: CardProps ) {
    const getVariantClasses = (variant: CardVariant) => {
        switch (variant) {
            case "success":
                return "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20";
            case "error":
                return "border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20";
            default:
                return "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800";
        }
    };

    const baseClasses = "p-2 rounded-xl border shadow-sm hover:shadow-lg transition-shadow duration-200";
    const variantClasses = getVariantClasses(variant);
    
    return <HeroCard className={clsx(baseClasses, variantClasses, className)} {...props} />
}

type CardHeaderProps = {
    className?: string;
    onEdit?: () => void;
    onDelete?: () => void;
    onRefresh?: () => void;
    onClose?: () => void;
    onClear?: () => void;
    spinner?: boolean,
    children?: React.ReactNode;
} & React.ComponentProps<typeof HeroCardHeader>;

export function CardHeader({ className = "", onEdit, onDelete, onRefresh, onClose, onClear, spinner = false, children, ...props }: CardHeaderProps ) {
    const refreshSpinner = spinner ? <Spinner size="sm" color="default" /> 
        : ( Boolean(onRefresh) ? <Icon src={refreshIcon} onClick={onRefresh} /> : null );

    return (
        <HeroCardHeader className={clsx("relative p-2 rounded-xl",className)} {...props}>
            <div className="absolute flex top-3 right-3 gap-3">
                { Boolean(onEdit) && <Icon src={editIcon} onClick={onEdit} /> }
                { refreshSpinner }
                { Boolean(onDelete) && <Icon src={deleteIcon} onClick={onDelete} /> }
                { Boolean(onClear) && <Icon src={clearIcon} onClick={onClear} /> }
                { Boolean(onClose) && <Icon src={closeIcon} onClick={onClose} /> }
            </div>
            {children}
        </HeroCardHeader>
    )
}

export function CardBody({ className = "", ...props }: any ) {
    return <HeroCardBody className={clsx("p-2",className)} {...props} />
}
