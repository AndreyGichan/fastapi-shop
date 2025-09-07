"use client"

const Slider = ({ value = [0, 100], onValueChange, max = 10000, step = 1, className = "" }) => {
  const [minVal, maxVal] = value

  const handleMinChange = (e) => {
    const newMin = Number(e.target.value)
    if (newMin > maxVal) {
      onValueChange([newMin, newMin])
    } else {
      onValueChange([newMin, maxVal])
    }
  }

  const handleMaxChange = (e) => {
    const newMax = Number(e.target.value)
    if (newMax < minVal) {
      onValueChange([newMax, newMax])
    } else {
      onValueChange([minVal, newMax])
    }
  }

  const handleMinInput = (e) => {
    let val = Number(e.target.value)
    if (isNaN(val)) return
    val = Math.min(Math.max(0, val), maxVal)
    onValueChange([val, maxVal])
  }

  const handleMaxInput = (e) => {
    let val = Number(e.target.value)
    if (isNaN(val)) return
    val = Math.max(minVal, Math.min(val, max))
    onValueChange([minVal, val])
  }

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div className="relative flex w-full h-2 my-2">
        <input
          type="range"
          min="0"
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto slider"
        />
        <input
          type="range"
          min="0"
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto slider"
        />
        <div className="absolute h-2 w-full bg-gray-300 rounded-lg"></div>
        <div
          className="absolute h-2 bg-violet-600 rounded-lg"
          style={{
            left: `${(minVal / max) * 100}%`,
            right: `${100 - (maxVal / max) * 100}%`,
          }}
        />
      </div>

      <div className="flex justify-between mt-2 gap-2">
        <input
          type="number"
          value={minVal || ""}
          placeholder="от"
          onChange={handleMinInput}
          className="w-1/2 border rounded px-2 py-1"
        />
        <input
          type="number"
          value={maxVal || ""}
          placeholder="до"
          onChange={handleMaxInput}
          className="w-1/2 border rounded px-2 py-1"
        />
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          z-index: 10;
          position: relative;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: none;
          z-index: 10;
          position: relative;
        }

        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  )
}

export default Slider
