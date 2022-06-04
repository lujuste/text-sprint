import React, { useState } from "react";
import GlobalStyle from "./GlobalStyle";

import Workspace from "./Workspace";

const template = [
  {
    x: 60,
    y: 18,
    text: "Contrato de Privacidade de Dados",
    fontSize: 29,
    fill: "#000",
    fontStyle: "normal",
    id: "simplasdasseText1",
    object: "simpleText",
  },
];

function App() {
  const [objectScreen, setObjectScreen] = useState<any>(template);

  return (
    <>
      <GlobalStyle />
      <Workspace setObjectScreen={setObjectScreen} template={objectScreen} />
    </>
  );
}

export default App;
