import { Types } from "mongoose";
import { Category, ICategory } from "../../models/Category";
import CustomError from "../../../../errorHandler";
import { slugify } from "../../utils/slugify";

export const createCategory = async (data: Partial<ICategory>): Promise<ICategory> => {
  const { name, description, image, parentCategory, sortOrder, isFeatured } = data;

  if (!name) {
    throw new CustomError("Имя категории обязательно", 400);
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new CustomError(`Категория "${name}" уже существует`, 400);
  }

  let level = 1;
  let path = slugify(name);

  if (parentCategory) {
    const parentCategoryDoc = await Category.findById(parentCategory);
    if (!parentCategoryDoc) {
      throw new CustomError("Родительская категория не найдена", 404);
    }

    level = (parentCategoryDoc.level || 1) + 1;
    path = `${parentCategoryDoc.path}/${slugify(name)}`;
  }

  // Создание новой категории
  const newCategory = await Category.create({
    _id: new Types.ObjectId(),
    name,
    description,
    image,
    sortOrder: sortOrder || 0,
    isFeatured: isFeatured || false,
    slug: slugify(name),
    level,
    path,
    parentCategory: parentCategory || null,
    childCategories: [],
  });

  // Обновление массива `childCategories` родительской категории
  if (parentCategory) {
    await Category.findByIdAndUpdate(parentCategory, {
      $push: { childCategories: newCategory._id },
    });
  }

  return newCategory.toObject() as ICategory;
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  const categoryToDelete = await Category.findById(categoryId);

  if (!categoryToDelete) {
    throw new CustomError("Категория не найдена", 404);
  }

  if (categoryToDelete.childCategories && categoryToDelete.childCategories.length > 0) {
    throw new CustomError("Нельзя удалить категорию, у которой есть дочерние категории", 400);
  }

  if (categoryToDelete.parentCategory) {
    const parentCategoryDoc = await Category.findById(categoryToDelete.parentCategory);

    if (!parentCategoryDoc) {
      throw new CustomError("Родительская категория не найдена", 404);
    }

    if (!parentCategoryDoc.childCategories) {
      parentCategoryDoc.childCategories = [];
    }

    parentCategoryDoc.childCategories = parentCategoryDoc.childCategories.filter(
      (id) => id.toString() !== categoryId
    );

    await parentCategoryDoc.save();
  }

  // Удаляем саму категорию
  await Category.findByIdAndDelete(categoryId);
};

export const getCategories = async (): Promise<ICategory[]> => {
  return await Category.find({ parentCategory: null });
};

export const getCategoryById = async (id: string): Promise<ICategory> => {
  const category = await Category.findById(id).populate("childCategories");
  if (!category) {
    throw new CustomError("Категория не найдена", 404);
  }

  return category;
};

export const updateCategory = async (
  categoryId: string,
  data: Partial<ICategory>
): Promise<ICategory> => {
  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { $set: data },
    { new: true }
  );
  if (!updatedCategory) {
    throw new CustomError("Категория не найдена", 404);
  }
  return updatedCategory;
};