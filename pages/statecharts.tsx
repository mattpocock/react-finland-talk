import type { NextPage } from "next";
import { useRef, useState } from "react";
import { AsyncLoadVideoStatecharts } from "../lib/AsyncLoadVideoStatecharts";

const Home: NextPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={divRef}
      style={{ display: "inline-block" }}
      onMouseOver={() => {
        setIsHovered(true);
      }}
      onMouseOut={() => {
        setIsHovered(false);
      }}
    >
      <AsyncLoadVideoStatecharts
        isOnScreen
        videoSrc="https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
        bgImageSrc="https://source.unsplash.com/random/280x270"
        isHovered={isHovered}
      ></AsyncLoadVideoStatecharts>
    </div>
  );
};

export default Home;
