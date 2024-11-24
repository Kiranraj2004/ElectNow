import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitcher({children}) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme =
      localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
    document.documentElement.classList[savedTheme === 'dark' ? 'add' : 'remove']('dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList[newTheme === 'dark' ? 'add' : 'remove']('dark');
  };

  return (
    <div>
       <button
      onClick={toggleTheme}
      className=" absolute top-0   right-4 mt-11 p-2 rounded-md bg-gray-200 dark:bg-black text-black dark:text-gray-200  "
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
    {children}

    </div>
   
  );
}
