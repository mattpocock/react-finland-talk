import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AsyncLoadVideo } from "../lib/AsyncLoadVideo";
import styles from "../styles/Home.module.css";

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
      <AsyncLoadVideo
        isOnScreen
        videoSrc="https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
        bgImageSrc="https://source.unsplash.com/random/280x270"
        isHovered={isHovered}
      ></AsyncLoadVideo>
    </div>
  );
};

export default Home;
