import { Input } from '../ui/Input';

interface TagEditFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBlur: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TagEditForm: React.FC<TagEditFormProps> = ({ 
  value, 
  onChange, 
  onSubmit, 
  onBlur,
  inputRef 
}) => {
  return (
    <form onSubmit={onSubmit} className="px-4 py-2">
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="w-full text-sm bg-transparent border-t-0 border-x-0 border-b border-zinc-900 rounded-none h-6 px-0 focus-visible:ring-0"
      />
    </form>
  );
};
