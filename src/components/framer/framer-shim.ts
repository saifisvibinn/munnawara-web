/** Stubs so vendored Framer components can run outside Framer. */

export const useIsStaticRenderer = () => false

export const addPropertyControls = (_component: unknown, _controls?: unknown) => {
  /* no-op outside Framer */
}

export const ControlType = {
  Boolean: "boolean",
  BorderRadius: "borderRadius",
  Color: "color",
  Enum: "enum",
  EventHandler: "eventHandler",
  File: "file",
  Font: "font",
  Gap: "gap",
  Link: "link",
  Number: "number",
  Object: "object",
  Padding: "padding",
  Slot: "slot",
  String: "string",
  Transition: "transition",
} as const
