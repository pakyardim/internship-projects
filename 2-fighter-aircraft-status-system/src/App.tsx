import { useEffect, useState } from "react";

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [angle, setAngle] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);
  const [battery, setBattery] = useState<number>(100);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5175");

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.eventName === "PLANE_ANGLE") {
        const angle = parseFloat(message.data.angle);
        setAngle(angle);
      } else if (message.eventName === "PLANE_SPEED") {
        const speed = parseFloat(message.data.speed);
        setSpeed(speed);
      } else if (message.eventName === "PLANE_BATTERY") {
        const battery = parseFloat(message.data.battery);
        setBattery(battery);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const handleSend = (message: "START" | "STOP") => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.error("WebSocket is not connected");
    }
  };

  const arrowRotate = -152 + speed * 3.04;

  const arrowStyle = {
    transform: `rotate(${arrowRotate}deg)`,
    transition: "transform 0.2s ease",
  };

  const getColor = (percent: number) => {
    if (percent < 20) return "red";
    if (percent < 25) return "red";
    if (percent < 50) return "yellow";
    return "green";
  };

  const getRectangles = () => {
    const rects = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      if (battery > (i + 1) * 25) {
        rects[i] = 86;
      } else if (battery > i * 25) {
        rects[i] = (battery - i * 25) * (86 / 25);
      }
    }
    return rects;
  };

  const rectangles = getRectangles();
  const color = getColor(battery);

  const planeStyle = {
    transform: `rotate(${angle}deg)`,
    transition: "transform 0.2s ease",
  };

  return (
    <main>
      <div className="container">
        <div className="left">
          <svg
            viewBox="0 0 600 600"
            style={planeStyle}
            xmlns="http://www.w3.org/2000/svg"
            version="1.0"
          >
            <g transform="translate(-70, 0)">
              <path d="M 157.98695,184.38488 L 173.37483,168.20017 C 182.38616,159.18884 197.56012,162.31477 197.56012,162.31477 L 242.58958,168.47612 L 265.39575,146.16045 C 277.41087,134.35989 288.26269,152.4142 283.54247,158.63631 L 271.83305,172.24635 L 320.32641,181.22794 L 336.78707,162.03882 C 354.38063,141.01237 367.47041,159.95529 359.53185,171.11218 L 348.89521,184.56906 L 421.75804,194.07153 C 484.40828,133.78139 509.98537,108.77262 526.46939,123.63021 C 543.05967,138.5836 513.71315,168.38877 456.64135,227.17701 L 467.00204,302.24678 L 482.26714,289.52597 C 491.27847,282.01653 507.27901,294.06392 490.75822,309.72648 L 469.76089,329.52825 L 478.61969,378.66527 L 491.73923,368.58052 C 503.32523,359.35463 517.39476,371.55518 501.7322,388.29052 L 480.88803,409.28786 C 480.02981,409.93153 487.69305,452.38631 487.69305,452.38631 C 492.41327,473.19821 480.67347,480.80195 480.67347,480.80195 L 466.35838,493.27782 L 411.97962,339.67439 C 407.47395,326.15738 396.0546,311.47862 376.97351,313.22076 C 366.8894,314.29354 341.41552,331.49026 337.98263,335.56682 L 279.00579,392.27531 C 277.5039,393.34809 288.07915,465.99635 288.07915,465.99635 C 288.07915,468.14191 269.38054,492.66454 269.38054,492.66454 L 232.01433,426.14725 L 213.56128,434.7301 L 224.35108,417.93211 L 157.06733,379.9526 L 182.29502,361.49956 C 194.31014,364.28878 257.3034,371.36975 258.59073,370.72608 C 258.59073,370.72608 309.88762,319.85344 312.81633,316.77643 C 329.76623,298.96831 335.46935,292.31456 338.04402,283.51778 C 340.6208,274.71377 336.23117,261.81195 309.62838,245.4769 C 272.93937,222.94855 157.98695,184.38488 157.98695,184.38488 z" />
            </g>
          </svg>
        </div>
        <div className="right">
          <svg
            className="battery-svg"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 471.829 471.829"
          >
            {battery < 75 && (
              <text
                x="200"
                y="100"
                font-family="Verdana"
                font-size="36"
                fill="white"
              >
                {battery < 20 && (
                  <animate
                    attributeType="XML"
                    attributeName="fill"
                    values="#fff;#000;#fff;#fff"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                )}
                {battery}%
              </text>
            )}
            <path d="M319.089,27.221h-36.475V0h-95.27v27.221h-34.607c-22.517,0-40.829,18.317-40.829,40.832v362.946   c0,22.51,18.317,40.83,40.829,40.83h166.352c22.524,0,40.832-18.32,40.832-40.83V68.052   C359.921,45.538,341.613,27.221,319.089,27.221z M332.705,431.002c0,7.501-6.108,13.607-13.616,13.607H152.737   c-7.501,0-13.608-6.095-13.608-13.607V68.052c0-7.501,6.107-13.611,13.608-13.611h166.352c7.508,0,13.616,6.109,13.616,13.611">
              {battery < 20 && (
                <animate
                  attributeType="XML"
                  attributeName="fill"
                  values="#fff;#000;#fff;#fff"
                  dur="1s"
                  repeatCount="indefinite"
                />
              )}
            </path>
            {rectangles.map((height: number, index: number) => (
              <rect
                key={index}
                y={436 - height - index * 86 - index * 10}
                x={146}
                width="180"
                height={height}
                fill={color}
              >
                {battery < 20 && (
                  <animate
                    attributeType="XML"
                    attributeName="fill"
                    values="#ff0000;#000;#ff0000;#ff0000"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                )}
              </rect>
            ))}
          </svg>

          <div className="svg-container">
            <svg
              className="speedometer-circle-svg"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M511.984 36.128C230.016 36.128.639 265.536.639 547.504c0 177.152 89.68 339.185 239.903 433.408 14.944 9.472 34.688 4.88 44.097-10.096s4.88-34.72-10.096-44.095c-54.096-33.952-99.04-78.048-133.424-128.88l33.552-19.376c15.311-8.848 20.56-28.4 11.712-43.711-8.88-15.344-28.464-20.56-43.712-11.712l-33.6 19.391c-24.4-50.511-39.297-105.792-43.281-163.424h35.616c17.68 0 32-14.32 32-32s-14.32-32-32-32H65.95c4.24-58.687 19.776-114.304 44.56-164.592l32.16 18.56a31.745 31.745 0 0 0 15.97 4.288c11.055 0 21.807-5.744 27.743-16 8.847-15.312 3.6-34.88-11.712-43.713l-31.84-18.368c32.112-46.832 72.864-87.296 119.984-119.023l18.016 31.2c5.935 10.288 16.687 16 27.743 16 5.44 0 10.944-1.376 15.969-4.288 15.311-8.848 20.56-28.4 11.712-43.712l-17.953-31.072c49.329-23.792 103.68-38.656 160.976-42.816v39.872c0 17.68 14.32 32 32 32s32-14.32 32-32v-40c58.592 4.08 114.128 19.391 164.384 43.95l-17.36 30.049c-8.848 15.311-3.6 34.88 11.712 43.712a31.745 31.745 0 0 0 15.969 4.288c11.055 0 21.807-5.712 27.743-16l17.28-29.936a451.19 451.19 0 0 1 118.88 118.816l-29.968 17.312c-15.311 8.847-20.56 28.4-11.711 43.71 5.935 10.289 16.687 16 27.743 16 5.44 0 10.944-1.375 15.969-4.287l30.127-17.392C938.638 401.839 954 457.39 958.094 516H922.96c-17.68 0-32 14.32-32 32s14.32 32 32 32h35.12c-4.048 56.88-18.592 111.439-42.496 161.312l-31.68-18.288c-15.28-8.848-34.912-3.568-43.712 11.713-8.848 15.311-3.6 34.88 11.712 43.712l31.776 18.351c-35.103 52.24-81.44 97.393-137.359 131.824-15.055 9.28-19.712 29.008-10.464 44.032 6.065 9.808 16.529 15.216 27.28 15.216a31.896 31.896 0 0 0 16.753-4.752c152.464-93.904 243.472-256.784 243.472-435.632 0-281.952-229.408-511.36-511.376-511.36z" />
              <text
                x="420"
                y="932"
                font-family="Verdana"
                font-size="64"
                fill="white"
              >
                {speed}
              </text>
              <text
                x="420"
                y="1024"
                font-family="Verdana"
                font-size="64"
                fill="white"
              >
                KM/H
              </text>
            </svg>
            <svg
              className="speedometer-arrow-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 240 240"
              width="240"
              height="240"
              style={arrowStyle}
            >
              <polygon points="120,40 113,120 127,120" />
              <circle cx="120" cy="130" r="12" />
            </svg>
          </div>
        </div>
      </div>
      <div className="button-container">
        <button onClick={() => handleSend("START")}>start</button>
        <button onClick={() => handleSend("STOP")}>stop</button>
      </div>
    </main>
  );
}

export default App;
