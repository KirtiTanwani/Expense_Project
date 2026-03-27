import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-900">
      <div className="absolute top-0 right-0 p-8">
        <div className="flex gap-4">
          <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-indigo-500/30 transition transform hover:-translate-y-0.5">
            Login
          </Link>
        </div>
      </div>
      
      {/* Decorative background blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 text-center max-w-3xl px-6 glass-panel p-12 rounded-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          Track Your Expenses <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Like a Pro</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
          The ultimate system for Admins, Managers, and Employees. Bring clarity to your cash flow with our seamless platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition transform hover:-translate-y-1">
            Login to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
