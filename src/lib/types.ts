// lib/interfaces.ts

// export interface Product {
//   id: string;
//   name: string;
//   description: string | null;
//   price: string;
//   imageUrls: string[] | null;
//   category?: string | null;
//   brand?: string | null;
//   rating: string | null;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   attributes: Record<string, any> | null | undefined | unknown;
// }

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
export interface Category {
  id: string;
  name: string;
  imageUrl: string | null;
  description: string | null;
}

// Add other interfaces as needed
