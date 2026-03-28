import { useEffect, useMemo, useRef, useState } from 'react'

const SIDE_OPTIONS = [4, 6, 8, 10, 12, 20]

function randomDie(id, sides) {
  return {
    id,
    value: Math.ceil(Math.random() * sides),
    rotation: 0,
  }
}

function buildDice(count, sides) {
  return Array.from({ length: count }, (_, index) => randomDie(index + 1, sides))
}

function polarPoint(cx, cy, radius, angleDeg) {
  const angle = (angleDeg * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  }
}

function segmentPath(cx, cy, outerRadius, startAngle, endAngle) {
  const start = polarPoint(cx, cy, outerRadius, startAngle)
  const end = polarPoint(cx, cy, outerRadius, endAngle)
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${outerRadius} ${outerRadius} 0 0 1 ${end.x} ${end.y} Z`
}

function polygonPath(cx, cy, radius, sides) {
  const points = Array.from({ length: sides }, (_, index) => {
    const angle = -90 + (360 / sides) * index
    const point = polarPoint(cx, cy, radius, angle)
    return `${point.x},${point.y}`
  })

  return `M ${points.join(' L ')} Z`
}

function DieWheel({ die, sides, rolling }) {
  const step = 360 / sides
  const wheelClass = rolling ? 'die-wheel is-rolling' : 'die-wheel'
  const outerPath = useMemo(() => polygonPath(100, 100, 84, sides), [sides])

  return (
    <article className="die-card">
      <div className="die-pointer" aria-hidden="true" />

      <div className="die-stage">
        <div className={wheelClass} style={{ transform: `rotate(${die.rotation}deg)` }}>
          <svg viewBox="0 0 200 200" className="die-svg" role="img" aria-label={`d${sides} landed on ${die.value}`}>
            <defs>
              <clipPath id={`clip-${die.id}-${sides}`}>
                <path d={outerPath} />
              </clipPath>
            </defs>

            <path d={outerPath} className="die-outline" />

            <g clipPath={`url(#clip-${die.id}-${sides})`}>
              {Array.from({ length: sides }, (_, index) => {
                const centerAngle = -90 + index * step
                const startAngle = centerAngle - step / 2
                const endAngle = centerAngle + step / 2
                const labelPoint = polarPoint(100, 100, sides > 12 ? 54 : 58, centerAngle)
                const isWinner = index + 1 === die.value
                return (
                  <g key={index}>
                    <path
                      d={segmentPath(100, 100, 84, startAngle, endAngle)}
                      className={isWinner && !rolling ? 'segment segment-active' : 'segment'}
                      style={{ '--segment-index': index }}
                    />
                    <text
                      x={labelPoint.x}
                      y={labelPoint.y}
                      className="segment-label"
                      style={{ fontSize: sides > 12 ? '13px' : sides > 8 ? '15px' : '18px' }}
                    >
                      {index + 1}
                    </text>
                  </g>
                )
              })}
            </g>

            <circle cx="100" cy="100" r="18" className="die-hub" />
          </svg>
        </div>
      </div>

      {!rolling && (
        <div className="top-face">
          <span className="top-face-label">Top face</span>
          <strong>{die.value}</strong>
          <span className="top-face-type">d{sides}</span>
        </div>
      )}
    </article>
  )
}

export default function App() {
  const [diceCount, setDiceCount] = useState(2)
  const [sides, setSides] = useState(6)
  const [dice, setDice] = useState(() => buildDice(2, 6))
  const [rolling, setRolling] = useState(false)
  const timeoutRef = useRef(null)

  const rollDice = () => {
    window.clearTimeout(timeoutRef.current)
    setRolling(true)
    setDice((current) =>
      current.map((die, index) => {
        const value = Math.ceil(Math.random() * sides)
        const step = 360 / sides
        const extraTurns = 4 + ((index + value) % 3)
        return {
          ...die,
          value,
          rotation: extraTurns * 360 - (value - 1) * step,
        }
      }),
    )

    timeoutRef.current = window.setTimeout(() => {
      setRolling(false)
    }, 1450)
  }

  useEffect(() => {
    setDice(buildDice(diceCount, sides))
    setRolling(false)
    window.clearTimeout(timeoutRef.current)
  }, [diceCount, sides])

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">Simple Dice Roller</p>
        <h1>Pick the dice, click the table, read the result.</h1>
        <p className="intro">
          Each die shows all of its faces, spins during the roll, then settles with a clear
          2D top-face result.
        </p>
      </section>

      <section className="toolbar">
        <label className="control">
          <span>Number of dice</span>
          <input
            type="range"
            min="1"
            max="6"
            value={diceCount}
            onChange={(event) => setDiceCount(Number(event.target.value))}
          />
          <strong>{diceCount}</strong>
        </label>

        <label className="control">
          <span>Sides per die</span>
          <select value={sides} onChange={(event) => setSides(Number(event.target.value))}>
            {SIDE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                d{option}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className="roll-button" onClick={rollDice}>
          Roll now
        </button>
      </section>

      <section className="table" onClick={rollDice}>
        <div className="table-hint">Click anywhere here to roll</div>
        <div className="dice-grid">
          {dice.map((die) => (
            <DieWheel key={`${die.id}-${sides}`} die={die} sides={sides} rolling={rolling} />
          ))}
        </div>
      </section>

      <section className="results">
        <div>
          <span className="results-label">Total</span>
          <strong>{dice.reduce((sum, die) => sum + die.value, 0)}</strong>
        </div>
        <div>
          <span className="results-label">Rolls</span>
          <strong>{dice.map((die) => die.value).join(', ')}</strong>
        </div>
      </section>
    </main>
  )
}
