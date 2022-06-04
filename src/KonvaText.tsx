import React, { useRef, useState, useEffect } from "react";
import { Transformer, Text, Stage, Layer, Group } from "react-konva";
// import { Container } from './styles';

const KonvaText: React.FC<any> = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  quillRef,
  stageRef,
  objectScreen,
  setObjectScreen,
}) => {
  const shapeRef = useRef<any>();
  const trRef = useRef<any>();

  const [editorEnabled, setEditorEnabled] = useState(false);
  const [isTransform, setIsTransform] = useState(false);
  const [isCursor, setIsCursor] = useState({});

  useEffect(() => {
    console.log(isCursor, "cursor");
  }, [isCursor]);

  const onEdit = (event: any) => {
    setEditorEnabled(true);
    shapeRef.current?.visible(false);
    const textPosition = shapeRef.current!.getAbsolutePosition();
    const absPosition = event.target.getAbsolutePosition();
    const stageBox = stageRef.current.container().getBoundingClientRect();
    setIsCursor(absPosition);
    const editableAreaPosition = {
      x: stageBox.left + textPosition?.x,
      y: stageBox.top + textPosition?.y,
    };

    //connect quill js

    const quillEditor = quillRef.current.getEditor();
    quillRef.current.hookEditor(quillEditor);
    quillEditor.root.id = "quill-editor";
    quillEditor.root.style.position = "absolute";
    quillEditor.root.style.top = `${editableAreaPosition.y}px`;
    quillEditor.root.style.left = `${editableAreaPosition.x}px`;
    quillEditor.root.style.width = "auto";
    quillEditor.root.style.minWidth = `${shapeRef.current!.getWidth()}px`;
    quillEditor.root.style.height = "auto";
    quillEditor.root.style.minHeight = `${shapeRef.current!.textHeight}px`;
    quillEditor.root.style.maxHeight = "500px";
    quillEditor.root.style.color = shapeRef.current!.getAttr("fill");
    quillEditor.root.style.fontSize = `${shapeRef.current?.textHeight}px`;
    quillEditor.root.style.fontStyle = shapeRef.current!.getAttr("fontStyle");
    quillEditor.root.style.resize = "none";
    quillEditor.root.style.zIndex = "100";
    quillEditor.root.style.border = `none`;
    quillEditor.root.style.background = "transparent";
    quillEditor.root.style.visibility = "visible";
    document.body.appendChild(quillEditor.root);
    quillEditor.setText(shapeRef.current!.text().trim());
    quillEditor.focus();
    
    quillEditor.root.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        console.log("enter");

        // setObjectScreen({
        //   ...objectScreen,
        // });

        let editedStyles: any;
        if (quillEditor && Object.keys(quillEditor).length > 0) {
          const editedContent =
            quillRef.current.makeUnprivilegedEditor(quillEditor);
          console.log(editedContent, "edited");
          editedStyles = quillRef.current.getEditor().getFormat();
          console.log(editedStyles, "oque é");

          shapeRef.current!.visible(true);
          shapeRef.current?.setAttr(
            "fill",
            editedStyles.color
              ? editedStyles.color
              : shapeRef.current.getAttr("fill")
          );
          shapeRef.current?.setText(
            editedContent.getText().trim()
              ? editedContent.getText()
              : shapeRef.current.text()
          );
          if (editedStyles.bold && editedStyles.italic) {
            shapeRef.current!.fontStyle("italic bold");
          } else if (editedStyles.bold) {
            shapeRef.current!.fontStyle("bold");
          } else if (editedStyles.italic) {
            shapeRef.current!.fontStyle("italic");
          } else {
            shapeRef.current!.fontStyle("normal");
          }
        }

        // Disconnect ReactQuill Editor and Remove from DOM

        quillRef.current.unhookEditor(quillEditor);
        // **Warning**: Remove quill editor from dom will cause quill to get out-of-sync
        // document.getElementById("quill-editor")?.removeChild();
        // document.body.removeChild(quillEditor.root);
        // document.getElementById("quill-editor")?.style.setProperty("display", "none");
        quillEditor.root.style.visibility = "hidden";
      }
    });
  };

  useEffect(() => {
    if (isSelected && trRef.current !== null) {
      // we need to attach transformer manually
      trRef.current?.setNodes([shapeRef.current]);
      trRef.current?.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={onEdit}
        ref={shapeRef}
        {...shapeProps}
        draggable={true}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
        perfectDrawEnabled={false}
      />
      {isSelected && (
        <Transformer
          rotateEnabled={false}
          flipEnabled={false}
          enabledAnchors={["middle-left", "middle-right"]}
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default KonvaText;
