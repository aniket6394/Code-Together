import { Decoration, ViewPlugin, WidgetType } from "@codemirror/view";

class CursorWidget extends WidgetType {
  constructor(username, color) {
    super();
    this.username = username;
    this.color = color;
  }

  toDOM() {
    const wrapper = document.createElement("span");
    wrapper.style.position = "relative";

    const cursor = document.createElement("span");
    cursor.style.borderLeft = `3px solid ${this.color}`;
    cursor.style.height = "20px";
    cursor.style.display = "inline-block";

    const label = document.createElement("div");
    label.textContent = this.username;

    label.style.position = "absolute";
    label.style.top = "-20px";
    label.style.left = "0";

    label.style.background = this.color;
    label.style.color = "#000";
    label.style.fontSize = "10px";
    label.style.fontWeight = "bold";
    label.style.padding = "2px 6px";
    label.style.borderRadius = "5px";
    label.style.whiteSpace = "nowrap";
    label.style.zIndex = "1000";

    wrapper.appendChild(cursor);
    wrapper.appendChild(label);

    return wrapper;
  }
}

export function createCursorPlugin(remoteCursors) {
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
          remoteCursors.map((cursor) =>
            Decoration.widget({
              widget: new CursorWidget(cursor.username, cursor.color),
              side: 1,
            }).range(cursor.cursorPosition),
          ),
        );
      }
    },
    {
      decorations: (v) => v.decorations,
    },
  );
}
