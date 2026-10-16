import { useEffect } from "react";

export default function LoadingScene({ onFinish }) {
  useEffect(() => {
    if (onFinish) onFinish();
  }, [onFinish]);

  return <div style={{ width: "100%", height: "100dvh", background: "#060504" }} />;
}