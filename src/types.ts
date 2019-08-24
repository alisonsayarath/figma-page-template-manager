export type TemporaryPageId = string;
export type PageName = string;
export type Page = {
  id?: TemporaryPageId;
  name: PageName;
};
export type Pages = Page[];

export type Template = {
  name: string;
  id: string;
  isDefault: boolean;
  pages?: Pages;
  isSelected?: boolean;
};

export type MessageState =
  | "TRIGGER_CHANGES"
  | "CREATE_TEMPLATE_FROM_PAGE"
  | "CREATE_TEMPLATE"
  | "CHANGE_TEMPLATE";

export type Message = {
  action: MessageState;
  data: Pages;
};
