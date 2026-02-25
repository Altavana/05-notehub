import css from './SearchBox.module.css';

interface SearchBoxProps {
  onChange: (query: string) => void;
}

export default function SearchBox({ onChange }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      name="query"
      onChange={event => onChange(event.target.value)}
    />
  );
}
