/** Stubs so the vendored Framer Video Player can run outside Framer. */

export const useIsStaticRenderer = () => false

export const addPropertyControls = (_component: unknown, _controls?: unknown) => {
  /* no-op outside Framer */
}

export const ControlType = {
  Boolean: "boolean",
  Color: "color",
  Enum: "enum",
  File: "file",
  Number: "number",
  String: "string",
} as const
