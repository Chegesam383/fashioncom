export interface Product {
  id: string;
  name: string;
  oldPrice?: string | null;
  description?: string | null;
  price: string;
  imageUrls: string[] | null;
  category?: string | null;
  subcategory?: string | null;
  brand?: string | null;
  rating?: string | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: any | null | undefined | unknown;
}
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  description?: string | null;
}

export interface ProductSubcategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  description: string | null;
  categoryId: string | null;
}

export interface CategoryWithSubcategories extends ProductCategory {
  subcategories?: ProductSubcategory[];
}
