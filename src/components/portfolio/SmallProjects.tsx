import { Localized } from "./Locale";
import { smallProjects } from "./data";
import { Icon } from "./Icon";

type Visual = (typeof smallProjects)[number]["id"];

function ProjectDrawing({ type }: { type: Visual }) {
  let drawing;
  switch (type) {
    case "dns":
      drawing = (
        <>
          <path
            d="M80 89h67m22 0h69M160 66V38m0 76v30"
            className="drawing-wire"
          />
          <rect
            x="22"
            y="65"
            width="69"
            height="48"
            rx="5"
            className="drawing-panel"
          />
          <text x="56" y="94" textAnchor="middle">
            .dev
          </text>
          <circle cx="160" cy="89" r="29" className="drawing-accent" />
          <text x="160" y="94" textAnchor="middle" className="drawing-inverse">
            DNS
          </text>
          <rect
            x="233"
            y="65"
            width="68"
            height="48"
            rx="5"
            className="drawing-panel"
          />
          <text x="267" y="94" textAnchor="middle">
            A / AAAA
          </text>
          <circle cx="160" cy="31" r="8" className="drawing-node" />
          <circle cx="160" cy="148" r="8" className="drawing-node" />
        </>
      );
      break;
    case "timetable":
      drawing = (
        <>
          <rect
            x="43"
            y="24"
            width="235"
            height="139"
            rx="5"
            className="drawing-panel"
          />
          {["MON", "TUE", "WED", "THU", "FRI"].map((day, index) => (
            <text
              key={day}
              x={69 + index * 45}
              y="45"
              textAnchor="middle"
              className="drawing-small"
            >
              {day}
            </text>
          ))}
          {Array.from({ length: 20 }, (_, index) => (
            <rect
              key={index}
              x={51 + (index % 5) * 45}
              y={57 + Math.floor(index / 5) * 24}
              width="36"
              height="16"
              rx="3"
              className={index % 3 === 0 ? "drawing-accent" : "drawing-cell"}
              opacity={index % 4 === 0 ? 0.45 : 1}
            />
          ))}
        </>
      );
      break;
    case "doubts":
      drawing = (
        <>
          <rect
            x="33"
            y="26"
            width="207"
            height="65"
            rx="10"
            className="drawing-panel"
          />
          <text x="52" y="50">
            A good question.
          </text>
          <path d="M53 65h94m-94 9h145" className="drawing-line" />
          <rect
            x="94"
            y="106"
            width="193"
            height="51"
            rx="10"
            className="drawing-accent"
          />
          <path
            d="m111 128 6 6 11-13"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
          />
          <text x="140" y="134" className="drawing-inverse">
            A little clarity.
          </text>
          <path d="M46 90v12l17-12" className="drawing-panel" />
        </>
      );
      break;
    case "health":
      drawing = (
        <>
          <rect
            x="34"
            y="24"
            width="252"
            height="137"
            rx="6"
            className="drawing-panel"
          />
          <text x="52" y="47" className="drawing-small">
            YOUR HEALTH, IN VIEW
          </text>
          <path d="M48 126h225M48 96h225M48 66h225" className="drawing-grid" />
          <path
            d="M49 110h32l12-17 16 43 22-75 19 49h26l16-24 12 24h66"
            className="drawing-heartbeat"
          />
          <circle cx="270" cy="110" r="4" className="drawing-accent" />
        </>
      );
      break;
    case "website-v2":
      drawing = (
        <>
          <rect
            x="35"
            y="27"
            width="250"
            height="133"
            rx="5"
            className="drawing-panel"
          />
          <path d="M35 48h250" className="drawing-grid" />
          <text x="48" y="42" className="drawing-small">
            NAMAN / V2
          </text>
          <text x="51" y="91" className="drawing-title">
            Hello, again.
          </text>
          <path d="M52 107h96m-96 10h73" className="drawing-line" />
          <rect
            x="52"
            y="131"
            width="44"
            height="9"
            rx="2"
            className="drawing-accent"
          />
          <rect
            x="197"
            y="65"
            width="64"
            height="74"
            rx="4"
            className="drawing-cell"
          />
          <circle cx="228" cy="90" r="13" className="drawing-accent" />
          <path d="M206 131c0-33 45-33 45 0" fill="#7e9fbd" />
        </>
      );
      break;
    case "retro":
      drawing = (
        <>
          <rect
            x="45"
            y="21"
            width="230"
            height="141"
            rx="5"
            className="drawing-panel"
          />
          {Array.from({ length: 60 }, (_, index) => (
            <circle
              key={index}
              cx={67 + (index % 12) * 17}
              cy={52 + Math.floor(index / 12) * 21}
              r="1"
              fill="#647d972f"
            />
          ))}
          {[
            [4, 1],
            [4, 2],
            [4, 3],
            [5, 3],
            [6, 3],
            [7, 3],
            [7, 2],
          ].map(([x, y], index) => (
            <rect
              key={index}
              x={59 + x * 17}
              y={44 + y * 21}
              width="15"
              height="18"
              rx="2"
              className="drawing-accent"
              opacity={0.45 + index * 0.08}
            />
          ))}
          <rect x="84" y="111" width="11" height="11" rx="2" fill="#355573" />
          <text x="257" y="37" textAnchor="end" className="drawing-small">
            SNAKE_
          </text>
        </>
      );
      break;
    case "website-v1":
      drawing = (
        <>
          <rect
            x="41"
            y="25"
            width="238"
            height="133"
            rx="5"
            className="drawing-dark"
          />
          <text x="57" y="47" className="drawing-small drawing-inverse">
            ~/my-first-website
          </text>
          <path d="M42 59h236" stroke="#ffffff22" />
          <text x="59" y="84" className="drawing-code">
            &lt;hello world=&quot;web&quot;&gt;
          </text>
          <text x="74" y="107" className="drawing-code">
            Let’s build something.
          </text>
          <text x="59" y="130" className="drawing-code">
            &lt;/hello&gt; _
          </text>
        </>
      );
      break;
    case "agro":
      drawing = (
        <>
          <circle cx="237" cy="46" r="20" fill="#a5bbc9" />
          <path d="M28 145c60-99 153-30 264-63v76H28Z" fill="#9fb9b1" />
          <path d="M28 139c93-39 164-14 264-55v74H28Z" fill="#6e928b" />
          <path
            d="M81 137V46m0 39c-28 0-26-23-26-23 23-1 26 23 26 23Zm0-18c28 0 26-23 26-23-23-1-26 23-26 23Zm0 43c28 0 26-23 26-23-23-1-26 23-26 23Z"
            fill="#d4dfce"
            stroke="#4f756b"
            strokeWidth="2"
          />
          <path
            d="M142 156c25-38 65-46 111-55m-72 55c22-25 52-37 91-42"
            stroke="#cad9cb"
            strokeWidth="2"
            fill="none"
          />
        </>
      );
      break;
    case "cloud":
      drawing = (
        <>
          <path d="m160 66 77 40-77 42-77-42Z" fill="#8aa8c4" />
          <path
            d="m160 48 77 40-77 42-77-42Z"
            fill="#b7c9db"
            stroke="#edf2f7"
          />
          <path d="m160 30 77 40-77 42-77-42Z" className="drawing-accent" />
          <path d="m160 60 22 11-22 11-22-11Z" fill="#e7f2ff" />
          <path
            d="M83 106H49v37m188-37h34v37m-111 5v14"
            className="drawing-wire"
          />
          {[49, 160, 271].map((x) => (
            <circle
              key={x}
              cx={x}
              cy={x === 160 ? 164 : 149}
              r="6"
              className="drawing-node"
            />
          ))}
        </>
      );
  }
  return (
    <Localized>
      <svg
        viewBox="0 0 320 185"
        fill="none"
        aria-hidden="true"
        className="small-project-drawing"
      >
        {drawing}
      </svg>
    </Localized>
  );
}

export default function SmallProjects() {
  return (
    <Localized>
      <div id="small-projects" className="small-projects">
        <div className="small-projects-heading" data-reveal>
          <div>
            <span className="eyebrow">THE REST OF THE SKETCHBOOK</span>
            <h3>
              Small projects.
              <br />
              <span>Big learning curves.</span>
            </h3>
          </div>
          <p>
            A few earlier builds, experiments,
            <br />
            and things made just to figure them out.
          </p>
        </div>
        <div className="small-project-grid">
          {smallProjects.map((project, index) => (
            <article
              className={`small-project small-project-${project.id}`}
              key={project.id}
              data-reveal
            >
              <div className="small-project-art">
                <span className="eyebrow">
                  {String(index + 1).padStart(2, "0")} / EXPLORATIONS
                </span>
                <ProjectDrawing type={project.id} />
              </div>
              <div className="small-project-copy">
                <span className="eyebrow">{project.category}</span>
                <h4>{project.name}</h4>
                <p>{project.description}</p>
                <div className="tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                {"link" in project && (
                  <a
                    className="text-link"
                    href={project.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.link.label}
                    <Icon name="arrow" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        <p className="small-projects-caption eyebrow">
          ILLUSTRATED SNAPSHOTS FROM THE LEARNING YEARS.
        </p>
      </div>
    </Localized>
  );
}
