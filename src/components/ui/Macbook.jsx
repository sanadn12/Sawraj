import React from "react";
import { MacbookScroll } from "@/components/ui/macbook-scroll";

export function MacbookScrollDemo() {
  return (
    <div className="w-full overflow-hidden bg-white -mt-80  ">
      <MacbookScroll
       
        badge={
          <a href="https://sawraj.in/">
            <Badge className="h-10 w-10  -rotate-12 transform" />
          </a>
        }
        src={`https://sawraj.in/selogo.jpg`}
        showGradient={false} />
    </div>
  );
}
// Peerlist logo
const Badge = ({ className }) => {
  return (
    <img
      src="https://sawraj.in/selogo.jpg"  // place badge.png inside the "public" folder
      alt="Badge"
      className={className}
    />
  );
};

