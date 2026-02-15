import { Github } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

export const Header = () => {
  return (
    <header className="w-full max-w-5xl flex items-center justify-between py-8 px-6 md:px-8">
      <div className="flex items-center gap-3 group">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white transition-colors">
          Typing<span className="text-yellow-500">App</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <a href="https://github.com/TechDaveDev" target='_blank' className='bg-slate-200 dark:bg-slate-800 p-2 rounded-full transition-colors duration-100'>
          <Github className='transition-colors' />
        </a>
        <ThemeSwitcher />
      </div>
    </header>
  );
};