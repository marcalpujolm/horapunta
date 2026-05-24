import "./index.css";
import { Composition } from "remotion";
import { HoraPuntaFilm }  from "./Composition";
import { HoraPuntaPromo } from "./HoraPuntaPromo";

export const RemotionRoot: React.FC = () => (
  <>
    {/* 60s CSS 3D promotional video — vertical */}
    <Composition
      id="HoraPuntaPromo"
      component={HoraPuntaPromo}
      durationInFrames={1800}
      fps={30}
      width={1080}
      height={1920}
    />

    {/* 60s CSS 3D promotional video — horizontal */}
    <Composition
      id="HoraPuntaPromo_H"
      component={HoraPuntaPromo}
      durationInFrames={1800}
      fps={30}
      width={1920}
      height={1080}
    />

    {/* 18s Three.js atmospheric brand film */}
    <Composition
      id="HoraPuntaFilm"
      component={HoraPuntaFilm}
      durationInFrames={540}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
