import React from "react";
import { Transformer, Text, Stage, Layer, Group } from "react-konva";

import { StageContainer } from "./styles";

import KonvaText from "./KonvaText";

const Konva: React.FC<any> = ({
  objectScreen,
  objectSelectId,
  setObjectSelectId,
  setObjectScreen,
  stageRef,
  quillRef,
}) => {
  return (
    <StageContainer>
      <Stage ref={stageRef} width={500} height={600}>
        <Layer>
          {objectScreen?.map((value: any, index: any) => (
            <KonvaText
              stageRef={stageRef}
              quillRef={quillRef}
              objectScreen={objectScreen}
              setObjectScreen={setObjectScreen}
              key={value.id}
              shapeProps={value}
              isSelected={value.id === objectSelectId}
              onSelect={() => {
                setObjectSelectId(value.id);
              }}
              onChange={(newAttrs: any) => {
                console.log(newAttrs);
                const rects = objectScreen.slice();
                rects[index] = newAttrs;
                setObjectScreen(rects);
              }}
            />
          ))}
        </Layer>
      </Stage>
    </StageContainer>
  );
};

export default Konva;
