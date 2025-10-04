import { useTheme } from "@/contexts/ThemeContext";
import { MoonStar, Sun } from "lucide-react";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div 
      className="hover:cursor-pointer" 
      onClick={() => toggleTheme()}
    >
      {theme != "light" ? <Sun size={20} /> : <MoonStar size={20} />}
    </div>
  );
};

export default ThemeToggleButton;
