export default function Card({ children, className = "" }) {
  return (
    <div className={`w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-100 p-8 ${className}`}>
      {children}
    </div>
  );
}