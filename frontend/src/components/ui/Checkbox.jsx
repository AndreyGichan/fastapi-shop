"use client"

const Checkbox = ({ id, checked, onCheckedChange, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className={`appearance-none w-5 h-5 border border-gray-400 rounded cursor-pointer
          ${checked ? "bg-black border-black" : "bg-white"} 
          focus:outline-none`}
      />
      {checked && (
        <svg
          className="absolute top-0 left-0 w-5 h-5 text-white pointer-events-none"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 10l4 4 8-8" />
        </svg>
      )}
    </div>
  )
}

export default Checkbox
