// Open section type — any theme can define any section type.
// props is Record<string, unknown> at the storage/transport layer;
// individual section components are responsible for their own prop types.
export type ShopSection = {
  id: string;
  type: string;
  props: Record<string, unknown>;
};

export type SectionType = string;
