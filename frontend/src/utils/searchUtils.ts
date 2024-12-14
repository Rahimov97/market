/**
 * Выполняет навигацию на страницу поиска с переданным поисковым запросом.
 * @param navigate - Функция навигации (например, из useNavigate).
 * @param searchTerm - Текст поиска.
 * @param path - Путь для поиска (по умолчанию "/search").
 */
export const handleSearchNavigate = (
  navigate: (path: string) => void,
  searchTerm: string,
  path: string = "/search"
) => {
  if (!searchTerm.trim()) return; // Проверка на пустой запрос
  navigate(`${path}?query=${encodeURIComponent(searchTerm)}`);
};
