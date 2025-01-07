'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          加载出错
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          请稍后重试
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          重新加载
        </button>
      </div>
    </div>
  );
} 