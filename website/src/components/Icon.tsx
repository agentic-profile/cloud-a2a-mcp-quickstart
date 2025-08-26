import { Icon } from "@iconify/react";
import type { IconifyIcon } from "@iconify/types";

type Props = {
    src: IconifyIcon | string,
    className?: string,
    onClick?: ()=>void
}

export default function IconComponent({ src, className, onClick }: Props) {
    const handleClick = (event: React.MouseEvent) => {
        if( onClick ) {
            event.preventDefault();
            onClick();
        }
    }

    const defaultClassName = "text-black dark:text-white w-6 h-6 cursor-pointer";
    const combinedClassName = className ? `${defaultClassName} ${className}` : defaultClassName;

    return <Icon icon={src} className={combinedClassName} onClick={handleClick} />
}
