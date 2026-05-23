import "./index.css";
import { Composition } from "remotion";
import { HoraPuntaReel } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HoraPuntaReel"
        component={HoraPuntaReel}
        durationInFrames={480} // 16s × 30fps
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
