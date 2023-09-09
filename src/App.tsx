import JsBarcode from "jsbarcode";

import "./App.css";
import { useCallback, useState } from "react";

const DEFAULT_CODE = "628942663321";

function drawCode(el: HTMLOrSVGElement, code: string): void {
  JsBarcode(el, code, { format: "UPC" });
}

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [error, setError] = useState<string | undefined>(undefined);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const updateRef = useCallback(
    (el: SVGSVGElement | null) => {
      if (el === null) {
        return;
      }
      try {
        drawCode(el, code);
        setError(undefined);

        var svgData = el.outerHTML;
        var svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        var svgUrl = URL.createObjectURL(svgBlob);
        setDownloadUrl(svgUrl);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      }
    },
    [code]
  );

  const errMessage =
    error === undefined ? null : <p className="error">Error: {error}</p>;

  const downloadLink =
    downloadUrl === null ? null : (
      <a href={downloadUrl} download={"upc.svg"}>
        Download
      </a>
    );

  return (
    <div className="App">
      <div className="input">
        <input
          type="text"
          defaultValue={code}
          placeholder="GTI12"
          onChange={(e) => setCode(e.target.value)}
        />
        {errMessage}
      </div>
      <div
        className="output"
        style={{
          display: error === undefined ? undefined : "none",
        }}
      >
        <div className="upc">
          <svg ref={updateRef}></svg>
        </div>
        <div className="download">{downloadLink}</div>
      </div>
    </div>
  );
}

export default App;
