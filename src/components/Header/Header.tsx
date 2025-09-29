'use client';

import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

import { useUserStore } from '@/store';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useSuggestionNavigation } from '@/utils/hooks/useSuggestionNavigation';

import s from './Header.module.scss';
import { Input } from '../Input';
import { Text } from '../Text';
import { SearchSuggestions } from './components';
import { Button } from '../Button';
import { defaultLinks, type HeaderLink } from './config';
import { SearchStoreProvider, useSearchStore } from './model';
import { BurgerIcon } from '../icons/BurgerIcon';
import { CloseIcon } from '../icons/CloseIcon';

const Header = observer(() => {
  const { query, setQuery, filteredMovies } = useSearchStore();
  const { isAuthorized, user } = useUserStore();
  const [isFocused, setIsFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const debouncedQuery = useDebounce(inputValue, 300);

  const { highlightedIndex, handleKeyDown, reset } = useSuggestionNavigation({
    items: filteredMovies,
    onSelect: (movie) => {
      handleClear();
      router.push(`/movies/${movie.id}`);
    },
  });

  const handleClear = () => {
    setIsFocused(false);
    inputRef.current?.blur();
    setIsMenuOpen(false);
    reset();
  };

  useEffect(() => {
    setQuery(debouncedQuery);
  }, [debouncedQuery, setQuery]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const links: HeaderLink[] = [
    ...defaultLinks,
    {
      name: isAuthorized ? user?.displayName || 'Профиль' : 'Вход',
      path: isAuthorized ? '/profile' : '/login',
    },
  ];

  return (
    <header className={s.header}>
      <div className={s.logo}>
        <Link href="/movies">
          <Text view="p-20" weight="bold" color="primary">
            Movie Mind
          </Text>
        </Link>
      </div>

      <div className={s.burger}>
        <Button onClick={toggleMenu}>{isMenuOpen ? <CloseIcon /> : <BurgerIcon />}</Button>
      </div>

      <div className={cn(s.content, { [s.open]: isMenuOpen })}>
        <div className={s.header__find}>
          <Input
            ref={inputRef}
            placeholder="Поиск фильмов"
            value={inputValue}
            onChange={setInputValue}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={handleKeyDown}
          />
          {isFocused && (
            <SearchSuggestions onClick={handleClear} highlightedIndex={highlightedIndex} />
          )}
        </div>
        <nav className={s.header__nav}>
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={isActive ? s.activeLink : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
});

export default function HeaderWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchStoreProvider>
        <Header />
      </SearchStoreProvider>
    </Suspense>
  );
}
