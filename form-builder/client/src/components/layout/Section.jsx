import { Element, useNode } from "@craftjs/core";

export function Section({ children }) {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className="border rounded-lg p-4 bg-muted space-y-4"
    >
      <Element is="div" canvas>
        {children}
      </Element>
    </div>
  );
}
Section.craft = {
  displayName: "Section",
  rules: {
    canMoveIn: () => true,
  },
};
