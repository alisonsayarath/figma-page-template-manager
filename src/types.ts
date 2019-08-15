export type PageId = string;
export type TemporaryPageId = string;
export type PageName = string;
export type Page = {
  id?: PageId;
  _temporaryId?: TemporaryPageId;
  name: PageName;
};
export type Pages = Page[];

export type MessageState =
  | "TRIGGER_CHANGES"
  | "PAGE_CREATED"
  | "PAGE_RENAMED"
  | "PAGE_DELETED";
