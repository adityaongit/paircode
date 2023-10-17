import { useViews } from "../context/ViewContext";
import useLocalStorage from "../hooks/useLocalStorage";
import useWindowDimensions from "../hooks/useWD";
import { ReactNode } from "react";
import Split from "react-split";

function Splitter({ children }: { children: ReactNode }) {
  const { isSidebarOpen } = useViews();
  const { isMobile, width } = useWindowDimensions();
  const { setItem, getItem } = useLocalStorage();

  const getGutter = () => {
    const gutter = document.createElement("div");
    gutter.className = "h-full cursor-e-resizer hidden md:block hover:opacity-80 transition-all duration-300 hover:cursor-pointer";
    gutter.style.backgroundColor = "#2B2B2B";
    return gutter;
  };

  const getSizes = () => {
    if (isMobile) return [0, width];
    const savedSizes = getItem("editorSizes");
    let sizes = [20, 80];
    if (savedSizes) {
      sizes = JSON.parse(savedSizes);
    }
    return isSidebarOpen ? sizes : [0, width];
  };

  const getMinSizes = () => {
    if (isMobile) return [0, width];
    return isSidebarOpen ? [350, 350] : [50, 0];
  };

  const getMaxSizes = () => {
    if (isMobile) return [0, Infinity];
    return isSidebarOpen ? [Infinity, Infinity] : [0, Infinity];
  };

  const handleGutterDrag = (sizes: number[]) => {
    setItem("editorSizes", JSON.stringify(sizes));
  };

  const getGutterStyle = () => ({
    width: "3px",
    display: isSidebarOpen && !isMobile ? "block" : "none",
  });

  return (
    <Split
      sizes={getSizes()}
      minSize={getMinSizes()}
      gutter={getGutter}
      maxSize={getMaxSizes()}
      dragInterval={1}
      direction="horizontal"
      gutterAlign="center"
      cursor="e-resize"
      snapOffset={30}
      gutterStyle={getGutterStyle}
      onDrag={handleGutterDrag}
      className="flex h-screen min-h-screen max-w-full items-center justify-center overflow-x-hidden"
    >
      {children}
    </Split>
  );
}

export default Splitter;
