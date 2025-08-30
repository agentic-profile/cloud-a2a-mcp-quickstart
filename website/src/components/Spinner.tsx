import { Spinner as HeroSpinner } from "@heroui/react";
import clsx from "clsx";

interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
    className?: string;
    label?: string;
}

export const Spinner = ({ 
    size = "md", 
    color = "default", 
    className = "",
    label
}: SpinnerProps) => {
    return (
        <div className={clsx("flex items-center justify-center", className)}>
            <HeroSpinner 
                size={size} 
                color={color}
                label={label}
            />
        </div>
    );
};
