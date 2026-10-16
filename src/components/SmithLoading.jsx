import { useEffect } from "react";

export default function SmithLoading({ onComplete }) {
  useEffect(() => {
    if (onComplete) onComplete();
  }, [onComplete]);

  return <div style={{ width: "100%", height: "100dvh", background: "#060504" }} />;
}
