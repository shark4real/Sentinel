import React, { useState, useRef, useEffect } from 'react';

/**
 * SituationInput — The primary input for describing situations.
 * Not a chat input. This is a command line for the AI command center.
 */
interface SituationInputProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

const DEMO_PROMPTS = [
  'Users are reporting login failures',
  'Give me a high-level overview of today',
  'Something feels off, help me investigate',
  'This is escalating, what should I do now?',
];

const SituationInput: React.FC<SituationInputProps> = ({ onSubmit, isLoading }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  return (
    <div className="sentinel-input-area">
      {/* Quick-access demo prompts */}
      <div className="sentinel-input-area__prompts">
        {DEMO_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            className="sentinel-input-area__prompt-btn"
            onClick={() => {
              if (!isLoading) {
                onSubmit(prompt);
                setValue('');
              }
            }}
            disabled={isLoading}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Main input bar */}
      <form className="sentinel-input-area__form" onSubmit={handleSubmit}>
        <div className="sentinel-input-area__indicator">
          {isLoading ? (
            <span className="sentinel-input-area__spinner" />
          ) : (
            <span className="sentinel-input-area__chevron">▶</span>
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          className="sentinel-input-area__input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe a situation..."
          disabled={isLoading}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className="sentinel-input-area__submit"
          disabled={!value.trim() || isLoading}
        >
          Analyze
        </button>
      </form>
    </div>
  );
};

export default SituationInput;
