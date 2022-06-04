import React, { useEffect, useRef } from "react";
import Konva from "./Konva";
import { Toolbar, Container, ContainerKonva } from "./styles";

import ReactQuill, { Quill } from "react-quill";

const Workspace: React.FC<any> = ({ template, setObjectScreen }) => {
  const quillRef = useRef<ReactQuill>(null);
  const stageRef = useRef<any>(null);
  const [objectSelectId, setObjectSelectId] = React.useState("");
  useEffect(() => {
    const referenceEditor = quillRef!.current!.getEditor();

    console.log(referenceEditor, "referencia");
  }, [quillRef]);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [
        {
          color: [
            "#000000",
            "#e60000",
            "#ff9900",
            "#ffff00",
            "#008a00",
            "#0066cc",
            "#9933ff",
            "#ffffff",
            "#facccc",
            "#ffebcc",
            "#ffffcc",
            "#cce8cc",
            "#cce0f5",
            "#ebd6ff",
            "#bbbbbb",
            "#f06666",
          ],
        },
      ],
      [
        { header: 1 },
        { header: 2 },
        { size: ["small", false, "large", "huge"] },
      ],
      [{ align: [] }],

      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
  ];

  const [value, setValue] = React.useState("");

  return (
    <Container>
      <Toolbar>
        <ReactQuill
          ref={quillRef}
          modules={modules}
          formats={formats}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            border: "none",
          }}
        >
          <div style={{ display: "none" }} />
        </ReactQuill>
      </Toolbar>
      <ContainerKonva>
        <Konva
          setObjectScreen={setObjectScreen}
          setObjectSelectId={setObjectSelectId}
          objectSelectId={objectSelectId}
          objectScreen={template}
          stageRef={stageRef}
          quillRef={quillRef}
        />
      </ContainerKonva>
    </Container>
  );
};

export default Workspace;
