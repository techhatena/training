import { createContext, useState, useContext } from "react";

export const DragIndicatorContext = createContext();

export function DragIndicatorProvider({ children }) {
  const [dragIndicator, setDragIndicator] = useState({
    isDragging: false,
    draggingElementId: null,
    targetElementId: null,
    position: null, // "top" or "bottom"
  });

  return (
    <DragIndicatorContext.Provider value={{ dragIndicator, setDragIndicator }}>
      {children}
    </DragIndicatorContext.Provider>
  );
}

export function useDragIndicator() {
  const context = useContext(DragIndicatorContext);
  if (!context) {
    throw new Error(
      "useDragIndicator must be used within DragIndicatorProvider"
    );
  }
  return context;
}
