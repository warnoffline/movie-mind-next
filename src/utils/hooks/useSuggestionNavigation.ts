import { useState } from 'react';

type UseSuggestionNavigationProps<T> = {
  items: T[];
  onSelect: (item: T) => void;
};

export function useSuggestionNavigation<T>({ items, onSelect }: UseSuggestionNavigationProps<T>) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      onSelect(items[highlightedIndex]);
    }
  };

  const reset = () => setHighlightedIndex(-1);

  return { highlightedIndex, handleKeyDown, setHighlightedIndex, reset };
}
