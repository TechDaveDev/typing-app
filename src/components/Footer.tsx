export const Footer = () => {
  return (
    <footer className="w-full max-w-5xl mt-auto py-10 px-6 md:px-8 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">

        <div className="flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-default">
            Hecho con Next.js, Tailwind y TypeScript
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1">
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            Hecho por <span><a href='https://davidaliaga.vercel.app/' target='_blank' className='text-slate-950 dark:text-slate-100 font-semibold underline'>David Aliaga</a></span>
          </div>
        </div>

      </div>
    </footer>
  );
};