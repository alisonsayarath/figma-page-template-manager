export type PageId = number;
export type PageName = string;
export type Page = { id: PageId; name: PageName };
export type Pages = Page[];

export type MessageState =
  | "TRIGGER_CHANGES"
  | "PAGE_CREATED"
  | "PAGE_RENAMED"
  | "PAGE_DELETED";
