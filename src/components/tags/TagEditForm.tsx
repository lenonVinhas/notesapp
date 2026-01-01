import React from 'react';

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
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="w-full text-sm bg-transparent border-b border-zinc-900 outline-none"
      />
    </form>
  );
};
