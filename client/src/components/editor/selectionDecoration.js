import { Decoration, ViewPlugin } from "@codemirror/view";

export function createSelectionPlugin(remoteSelections) {
  return ViewPlugin.fromClass(
    class {
      decorations;

      constructor() {
        this.decorations = this.buildDecorations();
      }

      update() {
        this.decorations = this.buildDecorations();
      }

      buildDecorations() {
        return Decoration.set(
          remoteSelections
            // Ignore empty selections
            .filter(
              (selection) =>
                selection.from !== selection.to &&
                selection.from != null &&
                selection.to != null,
            )
            .map((selection) =>
              Decoration.mark({
                attributes: {
                  style: `
                    background: ${selection.color}55;
                    border-radius: 3px;
                  `,
                },
              }).range(selection.from, selection.to),
            ),
        );
      }
    },
    {
      decorations: (v) => v.decorations,
    },
  );
}
