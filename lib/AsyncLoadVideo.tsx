import { useEffect, useRef, useState } from "react";
import cssExports from "./AsyncLoadVideo.module.scss";

interface AsyncLoadVideoProps {
  videoSrc: string;
  bgImageSrc: string;
  isHovered: boolean;
  isOnScreen: boolean;
}

export const AsyncLoadVideo = (props: AsyncLoadVideoProps) => {
  const [videoLoaded, setHasVideoLoaded] = useState(false);
  const [imageLoaded, setHasImageLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (props.bgImageSrc && props.isOnScreen) {
      setHasImageLoaded(false);
      const image = new Image();

      image.onload = () => {
        setHasImageLoaded(true);
      };
      image.src = props.bgImageSrc;
    }
  }, [props.bgImageSrc, props.isOnScreen]);

  useEffect(() => {
    if (props.videoSrc && props.isOnScreen) {
      setHasVideoLoaded(false);
      const videoElem = document.createElement("video");

      videoElem.oncanplay = () => {
        setHasVideoLoaded(true);
      };

      videoElem.src = props.videoSrc;

      return () => {
        videoElem.remove();
      };
    }
  }, [props.videoSrc, props.isOnScreen]);

  useEffect(() => {
    const videoElem = videoRef.current;

    if (props.isHovered && videoElem && videoLoaded) {
      videoElem?.play();

      return () => {
        videoElem?.pause();
      };
    }
  }, [videoLoaded, props.isHovered]);

  if (imageLoaded) {
    return (
      <div className={cssExports.wrapper}>
        <video
          ref={videoRef}
          src={props.videoSrc}
          className={cssExports.video}
          muted
        />
        <img
          data-hidden={props.isHovered && videoLoaded ? "hidden" : ""}
          src={props.bgImageSrc}
          className={cssExports.image}
        />
      </div>
    );
  }

  return <div>Loading...</div>;
};
