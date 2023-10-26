import { useState } from "react";
import "./App.css";
import EditorComponent from "./components/lexicalEditor";
import ColorPickerDropDown from "./components/ui/colorpickerdropdown";
import { Baseline } from "lucide-react";

function App() {
  const [color, SetColor] = useState("#333");
  return (
    <>
      <ColorPickerDropDown
        trigger={<Baseline color={color} />}
        color={color}
        onColorChange={(e) => {
          SetColor(e);
        }}
      />

      <div
        style={{
          backgroundColor: "#ccc",
        }}
      >
        <EditorComponent />
      </div>
    </>
  );
}

export default App;
