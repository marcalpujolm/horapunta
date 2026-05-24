import "./index.css";
import { Composition } from "remotion";
import { HoraPuntaFilm } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HoraPuntaFilm"
        component={HoraPuntaFilm}
        durationInFrames={540} // 18s × 30fps
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
