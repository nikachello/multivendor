// Field type definitions for the section settings panel.
// Section metadata (labels, defaults, schemas) now lives in each theme's index.ts.

export type FlatFieldDef =
  | { type: "text";         key: string; label: string; placeholder?: string }
  | { type: "textarea";     key: string; label: string; placeholder?: string }
  | { type: "color";        key: string; label: string }
  | { type: "image-upload"; key: string; label: string }
  | {
      type: "select";
      key: string;
      label: string;
      options: { value: string | number; label: string }[];
    };

export type FieldDef =
  | FlatFieldDef
  | {
      type: "list";
      key: string;
      label: string;
      itemFields: FlatFieldDef[];
      itemDefault: Record<string, unknown>;
    }
  | { type: "select-shop-categories";      key: string; label: string }
  | { type: "multiselect-shop-categories"; key: string; label: string };
