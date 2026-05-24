import "./index.css";
import { Composition } from "remotion";
import { HoraPuntaPromo } from "./HoraPuntaPromo";

export const RemotionRoot: React.FC = () => (
  <>
    {/* 52s CSS promo — vertical */}
    <Composition
      id="HoraPuntaPromo"
      component={HoraPuntaPromo}
      durationInFrames={1560}
      fps={30}
      width={1080}
      height={1920}
    />

    {/* 52s CSS promo — horizontal */}
    <Composition
      id="HoraPuntaPromo-H"
      component={HoraPuntaPromo}
      durationInFrames={1560}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
