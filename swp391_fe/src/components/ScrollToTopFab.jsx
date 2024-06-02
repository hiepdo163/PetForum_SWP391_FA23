import React, { useCallback } from "react";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";

function ScrollToTopFab() {
  const trigger = useScrollTrigger({
    threshold: 100,
  });

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Zoom in={trigger}>
      <div
        role="presentation"
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1,
        }}
      >
        <Fab
          onClick={scrollToTop}
          color="primary"
          size="small"
          aria-label="Scroll back to top"
          style={{ backgroundColor: "#4a785f", color: "#fff" }}
        >
          <KeyboardArrowUp
            style={{ backgroundColor: "#4a785f", color: "#fff" }}
            fontSize="medium"
          />
        </Fab>
      </div>
    </Zoom>
  );
}

export default ScrollToTopFab;
