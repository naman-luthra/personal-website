// Convert Hilbert distance into coordinates on an 8 × 8 grid.
// This visual illustrates spatial ordering, not a live R-tree query.
function hilbertPoint(distance: number) {
  let x = 0;
  let y = 0;
  let remaining = distance;
  for (let size = 1; size < 8; size *= 2) {
    const right = 1 & Math.floor(remaining / 2);
    const up = 1 & (remaining ^ right);
    if (up === 0) {
      if (right === 1) {
        x = size - 1 - x;
        y = size - 1 - y;
      }
      [x, y] = [y, x];
    }
    x += size * right;
    y += size * up;
    remaining = Math.floor(remaining / 4);
  }
  return { x: 30 + x * 26, y: 30 + y * 26 };
}

const points = Array.from({ length: 64 }, (_, distance) =>
  hilbertPoint(distance),
);
const path = points
  .map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`)
  .join(" ");

export default function HilbertPreview() {
  return (
    <div className="project-mockup hilbert-window" aria-hidden="true">
      <div className="hilbert-topbar">
        <span className="window-dots">
          <i />
          <i />
          <i />
        </span>
        <span>spatial-index.cpp</span>
        <span>C++</span>
      </div>
      <div className="hilbert-visual-body">
        <svg className="hilbert-map" viewBox="0 0 242 242" fill="none">
          {[0, 1, 2, 3].map((quadrant) => (
            <rect
              key={quadrant}
              x={17 + (quadrant % 2) * 104}
              y={17 + Math.floor(quadrant / 2) * 104}
              width="104"
              height="104"
              rx="3"
              className={`hilbert-bounds bounds-${quadrant}`}
            />
          ))}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="2"
              fill="#7b96b5"
            />
          ))}
          <path d={path} stroke="#68839f" strokeWidth="1.3" />
          <path
            className="hilbert-trace"
            d={path}
            pathLength="1"
            stroke="#66b5ff"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <rect
            x="57"
            y="57"
            width="75"
            height="102"
            rx="2"
            stroke="#dbedff"
            strokeDasharray="4 3"
            fill="#007acc18"
          />
          <circle cx={points[0].x} cy={points[0].y} r="4" fill="#eceff3" />
          <circle cx={points[63].x} cy={points[63].y} r="4" fill="#3794ff" />
        </svg>
        <div className="hilbert-inspector">
          <span>SPATIAL ORDER</span>
          <strong>
            2D<span>↓</span>1D
          </strong>
          <div className="hilbert-tree">
            <i />
            <div>
              <i />
              <i />
            </div>
            <div>
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <p>
            Nearby in space.
            <br />
            Ordered along a curve.
          </p>
        </div>
      </div>
      <div className="hilbert-order">
        <span>HILBERT ORDER</span>
        <div>
          {Array.from({ length: 32 }, (_, index) => (
            <i key={index} style={{ opacity: 0.3 + (index / 31) * 0.7 }} />
          ))}
        </div>
        <span>→</span>
      </div>
      <div className="floating-label hilbert-label">
        <span>↳</span> FRACTALS MEET SPATIAL DATA
      </div>
    </div>
  );
}
