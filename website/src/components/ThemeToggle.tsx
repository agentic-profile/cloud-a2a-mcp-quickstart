import { useTheme } from 'next-themes';
import sun from "@iconify-icons/lucide/sun";
import moon from "@iconify-icons/lucide/moon";
import Icon from "./Icon";

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const isLight = theme === 'light';

    return (
        <Icon
            src={isLight ? moon : sun}
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
        />
    );
};
