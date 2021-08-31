import { useMachine } from "@xstate/react";
import { HtmlHTMLAttributes, useEffect, useRef, useState } from "react";
import { assign, createMachine } from "xstate";
import cssExports from "./AsyncLoadVideo.module.scss";

interface AsyncLoadVideoProps {
  videoSrc: string;
  bgImageSrc: string;
  isHovered: boolean;
  isOnScreen: boolean;
}

interface Context {
  imageSrc: string;
  videoSrc: string;
}

type Event =
  | {
      type: "IMAGE_SRC_CHANGED";
      src: string;
    }
  | {
      type: "VIDEO_SRC_CHANGED";
      src: string;
    }
  | {
      type: "VIDEO_LOAD_COMPLETE";
    }
  | {
      type: "MOUSE_OVER";
    }
  | {
      type: "MOUSE_OUT";
    };

const machine = createMachine<Context, Event>(
  {
    initial: "waitingForSrc",
    on: {
      IMAGE_SRC_CHANGED: {
        actions: assign({
          imageSrc: (context, event) => event.src,
        }),
        target: ".waitingForSrc",
      },
      VIDEO_SRC_CHANGED: {
        actions: assign({
          videoSrc: (context, event) => event.src,
        }),
        target: ".waitingForSrc",
      },
    },
    states: {
      waitingForSrc: {
        tags: ["showLoadingIndicator"],
        always: {
          cond: "hasASrcForImageAndVideo",
          target: "loadingImage",
        },
      },
      loadingImage: {
        tags: ["showLoadingIndicator"],
        invoke: {
          src: "loadImage",
          onDone: {
            target: "loadingVideo",
          },
        },
      },
      loadingVideo: {
        type: "parallel",
        states: {
          video: {
            initial: "loading",
            states: {
              loading: {
                on: {
                  VIDEO_LOAD_COMPLETE: "loaded",
                },
                invoke: {
                  src: "loadVideo",
                  onError: "errored",
                },
              },
              loaded: {
                tags: ["loaded"],
              },
              errored: {},
            },
          },
          cursor: {
            initial: "notHovered",
            states: {
              notHovered: {
                on: {
                  MOUSE_OVER: "hovered",
                },
              },
              hovered: {
                tags: ["hovered"],
                on: {
                  MOUSE_OUT: "notHovered",
                },
              },
            },
          },
        },
      },
    },
  },
  {
    guards: {
      hasASrcForImageAndVideo: (context) => {
        return Boolean(context.imageSrc && context.videoSrc);
      },
    },
    services: {
      loadImage: (context) => {
        return new Promise((resolve) => {
          const image = new Image();

          image.onload = () => {
            resolve(undefined);
          };
          image.src = context.imageSrc;
        });
      },
      loadVideo: (context) => (send) => {
        const videoElem = document.createElement("video");

        videoElem.oncanplay = () => {
          send("VIDEO_LOAD_COMPLETE");
        };

        videoElem.src = context.videoSrc;

        return () => {
          videoElem.remove();
        };
      },
    },
  },
);

export const AsyncLoadVideoStatecharts = (props: AsyncLoadVideoProps) => {
  const [state, send] = useMachine(machine, {
    context: {
      imageSrc: props.bgImageSrc,
      videoSrc: props.videoSrc,
    },
  });

  useEffect(() => {
    if (props.isHovered) {
      send({
        type: "MOUSE_OVER",
      });
    } else {
      send({
        type: "MOUSE_OUT",
      });
    }
  }, [props.isHovered]);

  useEffect(() => {
    send({
      type: "IMAGE_SRC_CHANGED",
      src: props.bgImageSrc,
    });
  }, [props.bgImageSrc]);

  useEffect(() => {
    send({
      type: "VIDEO_SRC_CHANGED",
      src: props.videoSrc,
    });
  }, [props.videoSrc]);

  const shouldPlay = state.hasTag("loaded") && state.hasTag("hovered");

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (shouldPlay) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [shouldPlay]);

  if (state.hasTag("showLoadingIndicator")) {
    return <div>Loading...</div>;
  }

  return (
    <div className={cssExports.wrapper}>
      <video
        ref={videoRef}
        src={state.context.videoSrc}
        className={cssExports.video}
      />
      <img
        data-hidden={shouldPlay ? "hidden" : ""}
        src={state.context.imageSrc}
        className={cssExports.image}
      />
    </div>
  );
};
