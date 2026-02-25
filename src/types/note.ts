export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
}
type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
export interface NewNote {
  title: string;
  content: string;
  tag: NoteTag;
}
