const transliterationMap: { [key: string]: string } = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh", з: "z", и: "i", й: "y",
    к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
    х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ы: "y", э: "e", ю: "yu", я: "ya",
    "ь": "", "ъ": ""
  };
  
  export const slugify = (text: string): string => {
    if (!text) {
      return "";
    }
  
    // Преобразуем текст в нижний регистр
    let slug = text.toLowerCase();
  
    // Заменяем русские символы на латинские по таблице транслитерации
    slug = slug
      .split("")
      .map((char) => transliterationMap[char] || char)
      .join("");
  
    // Удаляем все некорректные символы, заменяем пробелы на дефисы
    slug = slug.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  
    return slug;
  };
  