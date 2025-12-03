export default function Input({ 
  icon: Icon, 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  name,
  className = ""
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {Icon && <Icon className="w-4 h-4" />}
          {label}
        </label>
      )}
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      />
    </div>
  );
}