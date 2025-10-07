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
import { Button } from '../Button';
import { defaultLinks, type HeaderLink } from './config';
import { SearchStoreProvider, useSearchStore } from './model';
import { BurgerIcon } from '../icons/BurgerIcon';
import { CloseIcon } from '../icons/CloseIcon';
import { Input } from '../Input';
import { SearchSuggestions } from '../SearchSuggestions';
import { Skeleton } from '../Skeleton';
import { Text } from '../Text';

const Header = observer(() => {
  const { query, setQuery, filteredMovies, loadingStage: searchLoadingStage } = useSearchStore();
  const { isAuthorized, user, loadingStage } = useUserStore();
  const [isFocused, setIsFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const debouncedQuery = useDebounce(inputValue, 300);

  const { highlightedIndex, handleKeyDown } = useSuggestionNavigation({
    items: filteredMovies,
    onSelect: (movie) => {
      handleClear();
      router.push(`/movies/${movie.id}`);
    },
  });

  const handleClear = () => {
    setIsFocused(false);
    setInputValue('');
    inputRef.current?.blur();
    setIsMenuOpen(false);
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
            <SearchSuggestions
              onClick={(movie) => {
                handleClear();
                router.push(`/movies/${movie.id}`);
              }}
              highlightedIndex={highlightedIndex}
              movies={filteredMovies}
              loading={searchLoadingStage.isLoading}
            />
          )}
        </div>
        <nav className={s.header__nav}>
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={cn(s.links, isActive && s.activeLink)}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.path === '/login' && loadingStage.isLoading ? (
                  <Skeleton height={'100%'} width={'60px'} />
                ) : (
                  link.name
                )}
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
