export default function Button({ 
  children, 
  type = "button", 
  variant = "primary", 
  disabled = false, 
  onClick,
  className = ""
}) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-300",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 disabled:bg-gray-300"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}