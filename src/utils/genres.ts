export enum Genre {
  action = 'action',
  comedy = 'comedy',
  drama = 'drama',
  fantasy = 'fantasy',
  horror = 'horror',
  sciFi = 'sciFi',
  thriller = 'thriller',
  melodrama = 'melodrama',
  crime = 'crime',
  history = 'history',
  adventure = 'adventure',
  detective = 'detective',
  music = 'music',
  family = 'family',
}

export const GENRE_NAME_MAP: Record<Genre, string> = {
  [Genre.action]: 'Боевик',
  [Genre.comedy]: 'Комедия',
  [Genre.drama]: 'Драма',
  [Genre.fantasy]: 'Фэнтези',
  [Genre.horror]: 'Ужасы',
  [Genre.sciFi]: 'Фантастика',
  [Genre.thriller]: 'Триллер',
  [Genre.melodrama]: 'Мелодрама',
  [Genre.crime]: 'Криминал',
  [Genre.history]: 'История',
  [Genre.adventure]: 'Приключения',
  [Genre.detective]: 'Детектив',
  [Genre.music]: 'Музыка',
  [Genre.family]: 'Семейный',
};

export const GENRE_IMAGES_MAP: Record<Genre, string> = {
  [Genre.action]:
    'https://avatars.mds.yandex.net/get-ott/1534341/2a000001843847ce092f99de54ec03f9908f/720x360',
  [Genre.comedy]:
    'https://avatars.mds.yandex.net/get-ott/223007/2a0000018438302568b271ccc82563762fda/720x360',
  [Genre.drama]:
    'https://avatars.mds.yandex.net/get-ott/1534341/2a000001843892886831c9143cc8a793ff40/720x360',
  [Genre.fantasy]:
    'https://avatars.mds.yandex.net/get-ott/1652588/2a0000018438661c1d5d9534909bb30d0a26/720x360',
  [Genre.horror]:
    'https://avatars.mds.yandex.net/get-ott/1652588/2a0000018438345d1f13f3052ff693c01cc6/720x360',
  [Genre.sciFi]:
    'https://avatars.mds.yandex.net/get-ott/1534341/2a000001843844c85b8b9074853af40c5f51/720x360',
  [Genre.thriller]:
    'https://avatars.mds.yandex.net/get-ott/239697/2a00000184388fae65f740ea391765d55e4f/720x360',
  [Genre.melodrama]:
    'https://avatars.mds.yandex.net/get-ott/1534341/2a00000184387ced83a0309d9dbd841184f9/720x360',
  [Genre.crime]:
    'https://avatars.mds.yandex.net/get-ott/1534341/2a000001843847ce092f99de54ec03f9908f/720x360',
  [Genre.history]:
    'https://avatars.mds.yandex.net/get-ott/1534341/2a0000018438825ae96489247215e47b9304/720x360',
  [Genre.adventure]:
    'https://avatars.mds.yandex.net/get-ott/2439731/2a000001843865926b014c8f0d542b7c3205/720x360',
  [Genre.detective]:
    'https://avatars.mds.yandex.net/get-ott/1534341/2a0000018438799210583ef1dd416bad351a/720x360',
  [Genre.music]:
    'https://avatars.mds.yandex.net/get-ott/1672343/2a00000184388c71c6c0df025d421f8b2c25/720x360',
  [Genre.family]:
    'https://avatars.mds.yandex.net/get-ott/1531675/2a000001843884b6c652e846be0d1a34042f/720x360',
};

export const GENRE_COLORS_MAP: Record<Genre, string> = {
  [Genre.action]: '#e53935',
  [Genre.comedy]: '#695600ff',
  [Genre.drama]: '#6a1b9a',
  [Genre.fantasy]: '#8e24aa',
  [Genre.horror]: '#d32f2f',
  [Genre.sciFi]: '#0288d1',
  [Genre.thriller]: '#f57c00',
  [Genre.melodrama]: '#ff8a65',
  [Genre.crime]: '#6d4c41',
  [Genre.history]: '#8d6e63',
  [Genre.adventure]: '#43a047',
  [Genre.detective]: '#3949ab',
  [Genre.music]: '#9c27b0',
  [Genre.family]: '#0b5ab4ff',
};

export const DEFAULT_GENRE_COLOR = '#9146ff';

export const RU_TO_EN_GENRE_MAP: Record<string, Genre> = Object.fromEntries(
  Object.entries(GENRE_NAME_MAP).map(([en, ru]) => [ru, en as Genre])
);

export const getGenres = (genres: { name: string }[]) =>
  genres.map((g) => {
    const genreName = g.name.charAt(0).toUpperCase() + g.name.slice(1);
    const genreKey = RU_TO_EN_GENRE_MAP[genreName] as Genre | undefined;

    if (!genreKey) {
      return {
        label: genreName,
        color: DEFAULT_GENRE_COLOR,
      };
    }

    return {
      label: GENRE_NAME_MAP[genreKey],
      color: GENRE_COLORS_MAP[genreKey] || DEFAULT_GENRE_COLOR,
    };
  });
