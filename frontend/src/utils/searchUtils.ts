export const handleSearchNavigate = (navigate: (path: string) => void, searchTerm: string) => {
    if (!searchTerm.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };
  