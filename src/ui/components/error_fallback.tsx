type Props = {
  title?: string;
  message?: string;
  reset?: () => void;
};

export default function ErrorFallback({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  reset,
}: Props) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mb-6 text-sm text-gray-600">{message}</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => window.location.reload()}>Reload</button>
          {reset && <button onClick={reset}>Try again</button>}
        </div>
      </div>
    </div>
  );
}
