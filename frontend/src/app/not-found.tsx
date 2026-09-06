import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-indigo-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          Oops! The page you are looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm hover:shadow"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
