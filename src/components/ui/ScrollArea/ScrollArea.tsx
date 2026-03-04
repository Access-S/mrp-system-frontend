// src/components/ui/ScrollArea/ScrollArea.tsx

// ============== BLOCK 1: Imports ==============

import React, { useRef, useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import { useTheme } from "../../../contexts/ThemeContext";

// ============== BLOCK 2: Types & Interfaces ==============

export type ScrollOrientation = "vertical" | "horizontal" | "both";

export interface ScrollAreaProps {
  /** Content to be scrolled */
  children: React.ReactNode;
  /** Scroll direction */
  orientation?: ScrollOrientation;
  /** Maximum height (enables vertical scroll) */
  maxHeight?: string;
  /** Maximum width (enables horizontal scroll) */
  maxWidth?: string;
  /** Additional CSS classes */
  className?: string;
  /** Scrollbar thumb size in pixels */
  thumbSize?: number;
  /** Delay before hiding scrollbar (ms) */
  hideDelay?: number;
  /** Convert vertical mouse wheel to horizontal scroll (useful for horizontal ScrollAreas) */
  convertWheelToHorizontal?: boolean;
}

// ============== BLOCK 3: Constants ==============

const DEFAULT_THUMB_SIZE = 8;
const DEFAULT_HIDE_DELAY = 1000;

// ============== BLOCK 4: Component ==============

export function ScrollArea({
  children,
  orientation = "vertical",
  maxHeight,
  maxWidth,
  className,
  thumbSize = DEFAULT_THUMB_SIZE,
  hideDelay = DEFAULT_HIDE_DELAY,
  convertWheelToHorizontal = false,
}: ScrollAreaProps) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine if scrollbar should be visible
  const isVisible = isScrolling || isHovering;

  // Handle scroll event
  const handleScroll = useCallback(() => {
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set timeout to hide scrollbar
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, hideDelay);
  }, [hideDelay]);

  // Handle wheel event for horizontal scroll conversion
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!convertWheelToHorizontal || !containerRef.current) return;

      // Only convert if there's vertical wheel movement
      if (e.deltaY !== 0) {
        e.preventDefault();
        containerRef.current.scrollLeft += e.deltaY;
      }
    },
    [convertWheelToHorizontal]
  );

  // Attach wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !convertWheelToHorizontal) return;

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [convertWheelToHorizontal, handleWheel]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Generate unique ID for this instance
  const scrollId = useRef(`scroll-${Math.random().toString(36).substr(2, 9)}`);

  return (
    <>
      <style>{`
        .scroll-area-${scrollId.current}::-webkit-scrollbar {
          width: ${orientation === "horizontal" ? "0" : `${thumbSize}px`};
          height: ${orientation === "vertical" ? "0" : `${thumbSize}px`};
        }
        
        .scroll-area-${scrollId.current}::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scroll-area-${scrollId.current}::-webkit-scrollbar-thumb {
          background: ${isVisible ? theme.scrollbar.thumb : "transparent"};
          border-radius: ${thumbSize}px;
          transition: background 0.2s ease;
        }
        
        .scroll-area-${scrollId.current}::-webkit-scrollbar-thumb:hover {
          background: ${theme.scrollbar.thumbHover};
        }
        
        .scroll-area-${scrollId.current}::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
      <div
        ref={containerRef}
        data-scroll-id={scrollId.current}
        className={clsx(
          `scroll-area-${scrollId.current}`,
          // Overflow based on orientation
          orientation === "vertical" && "overflow-y-auto overflow-x-hidden",
          orientation === "horizontal" && "overflow-x-auto overflow-y-hidden",
          orientation === "both" && "overflow-auto",
          className
        )}
        style={{
          maxHeight: maxHeight,
          maxWidth: maxWidth,
        }}
        onScroll={handleScroll}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {children}
      </div>
    </>
  );
}

// ============== BLOCK 5: Exports ==============

export default ScrollArea;