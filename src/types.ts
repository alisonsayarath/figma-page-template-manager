export type TemporaryPageId = string;
export type PageName = string;
export type Page = {
  _temporaryId?: TemporaryPageId;
  name: PageName;
};
export type Pages = Page[];

export type MessageState = "TRIGGER_CHANGES" | "CREATE_TEMPLATE_FROM_PAGE";

export type Message = {
  action: MessageState;
  data: Pages;
};
