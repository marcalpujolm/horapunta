import "./index.css";
import { Composition } from "remotion";
import { HoraPuntaPromo } from "./HoraPuntaPromo";
import { SAdPassen }     from "./scenes/SAdPassen";

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

    {/* 27s AD "Passen" — vertical (Stories / Reels) */}
    <Composition
      id="Ad-Passen"
      component={SAdPassen}
      durationInFrames={810}
      fps={30}
      width={1080}
      height={1920}
    />

    {/* 27s AD "Passen" — horizontal (YouTube / LinkedIn) */}
    <Composition
      id="Ad-Passen-H"
      component={SAdPassen}
      durationInFrames={810}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
