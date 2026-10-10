/** Stubs so the vendored Framer Video Player can run outside Framer. */

export const useIsStaticRenderer = () => false

export const addPropertyControls = (..._args: unknown[]) => {
  void _args
}

export const ControlType = {
  Boolean: "boolean",
  Color: "color",
  Enum: "enum",
  File: "file",
  Number: "number",
  String: "string",
} as const
