import { useEffect, useRef, useState } from "react";

interface AsyncLoadVideoProps {
  videoSrc: string;
  bgImageSrc: string;
  isHovered: boolean;
  isOnScreen: boolean;
}

export const AsyncLoadVideo = (props: AsyncLoadVideoProps) => {
  const [videoLoaded, setHasVideoLoaded] = useState(false);
  const [imageLoaded, setHasImageLoaded] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (props.isOnScreen && props.bgImageSrc) {
      setImageSrc(props.bgImageSrc);
      setHasImageLoaded(false);
    }
  }, [props.isOnScreen, props.bgImageSrc]);

  useEffect(() => {
    if (props.isOnScreen && props.videoSrc) {
      setVideoSrc(props.videoSrc);
      setHasVideoLoaded(false);
    }
  }, [props.isOnScreen, props.videoSrc]);

  useEffect(() => {
    if (imageSrc && props.isOnScreen) {
      const image = new Image();

      image.onload = () => {
        setHasImageLoaded(true);
      };
      image.src = imageSrc;
    }
  }, [imageSrc, props.isOnScreen]);

  useEffect(() => {
    if (videoSrc && props.isOnScreen) {
      const videoElem = document.createElement("video");

      videoElem.oncanplaythrough = () => {
        setHasVideoLoaded(true);
      };

      videoElem.src = videoSrc;

      return () => {
        videoElem.remove();
      };
    }
  }, [videoSrc, props.isOnScreen]);

  if (videoSrc && props.isOnScreen && videoLoaded && props.isHovered) {
    return (
      <video src={videoSrc} autoPlay muted height="270px" width="480px"></video>
    );
  }

  if (imageSrc && imageLoaded && props.isOnScreen) {
    return <img src={imageSrc} height="270px" width="480px"></img>;
  }

  return <div>Loading...</div>;
};
