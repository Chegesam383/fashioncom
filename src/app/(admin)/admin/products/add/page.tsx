"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, ArrowLeft, Tag, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AttributeEditor,
  AttributeValue,
  ProductAttribute,
} from "../attributes-editor";
import { useRouter } from "next/navigation";
import {
  formatAttributesForSubmission,
  ProductVariantsTable,
} from "../attribute-table";
import Image from "next/image";
import { addProductAction } from "@/actions/productActions";
import { getCategoriesWithSubcategories } from "@/actions/categoryActions";
import { CategoryWithSubcategories, ProductCategory } from "@/lib/types";

// Define the validation schema for the product form
const productFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number." }),
  category: z.string().min(1, { message: "Please select a category." }),
  stock: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Stock must be a non-negative integer." }),
  sku: z.string().optional(),
});

interface Variant {
  id: string;
  combination: Record<string, AttributeValue>;
  price: number;
  stock: number;
  sku: string;
}

type FormValues = z.infer<typeof productFormSchema>;

// Interface for image data
interface ImageData {
  file: File;
  preview: string;
}

const AddProduct = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isGeneratingVariants, setIsGeneratingVariants] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [categories, setCategories] = useState<
    CategoryWithSubcategories[] | null | undefined
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      sku: "",
    },
  });

  const basePrice = form.watch("price") || 0;

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategoriesWithSubcategories();
        setCategories(fetchedCategories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).filter(
      (file) => !images.some((img) => img.file.name === file.name)
    );

    if (newFiles.length === 0) {
      toast.warning("All selected files are duplicates.");
      return;
    }

    const newImages = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  // Handle removing an image
  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => {
      const imageToRemove = prev[indexToRemove];
      URL.revokeObjectURL(imageToRemove.preview);
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  // Generate all possible variants when attributes change
  const generateVariants = () => {
    setIsGeneratingVariants(true);

    const attributesWithValues = attributes.filter(
      (attr) => attr.values.length > 0
    );

    if (attributesWithValues.length === 0) {
      toast.error("Please add at least one attribute with values first");
      setIsGeneratingVariants(false);
      return;
    }

    const generateCombinations = (
      attributes: ProductAttribute[],
      currentIndex: number,
      currentCombination: Record<string, AttributeValue> = {}
    ): Record<string, AttributeValue>[] => {
      if (currentIndex === attributes.length) {
        return [currentCombination];
      }

      const currentAttribute = attributes[currentIndex];
      const combinations: Record<string, AttributeValue>[] = [];

      if (currentAttribute.values.length === 0) {
        return generateCombinations(
          attributes,
          currentIndex + 1,
          currentCombination
        );
      }

      currentAttribute.values.forEach((value) => {
        const newCombination = {
          ...currentCombination,
          [currentAttribute.name]: value,
        };
        const newCombinations = generateCombinations(
          attributes,
          currentIndex + 1,
          newCombination
        );
        combinations.push(...newCombinations);
      });

      return combinations;
    };

    const combinations = generateCombinations(attributesWithValues, 0);

    const newVariants = combinations.map((combination, index) => {
      const existingVariant = variants.find((v) => {
        const combinationKeys = Object.keys(combination);
        const variantKeys = Object.keys(v.combination);
        if (combinationKeys.length !== variantKeys.length) return false;
        return combinationKeys.every(
          (key) =>
            v.combination[key] && v.combination[key].id === combination[key].id
        );
      });

      if (existingVariant) return existingVariant;

      const combinationStr = Object.values(combination)
        .map((v) => v.value)
        .join("-");

      return {
        id: `variant-${index}-${Date.now()}`,
        combination,
        price: basePrice,
        stock: 0,
        sku: `${form.watch("sku") || "SKU"}-${combinationStr}`,
      };
    });

    setVariants(newVariants);
    setIsGeneratingVariants(false);
    setActiveTab("variants");
    toast.success(`Generated ${newVariants.length} variants`);
  };

  const onSubmit = async (data: FormValues) => {
    if (attributes.length > 0 && variants.length === 0) {
      toast.warning(
        "You have attributes but haven't generated variants. Please generate variants first."
      );
      return;
    }

    setIsSubmitting(true);

    const formattedAttributes =
      variants.length > 0 ? formatAttributesForSubmission(variants) : null;

    // Create FormData to send to server action
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("category", data.category);
    formData.append("stock", String(data.stock));
    if (data.sku) formData.append("sku", data.sku);
    if (formattedAttributes) {
      formData.append("attributes", JSON.stringify(formattedAttributes));
    }
    images.forEach((img) => formData.append("images", img.file));

    try {
      await addProductAction(formData);
      toast.success("Product added successfully!");
      router.push("/products");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVariantChange = (
    variantId: string,
    field: "price" | "stock" | "sku",
    value: number | string
  ) => {
    setVariants(
      variants.map((variant) =>
        variant.id === variantId ? { ...variant, [field]: value } : variant
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl">Add New Product</h1>
            <p className="text-muted-foreground mt-1">
              Create a new product and define its variants
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/products")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="attributes">Attributes</TabsTrigger>
                <TabsTrigger value="variants">Variants</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Information</CardTitle>
                      <CardDescription>
                        Enter the basic details for your product.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Premium Wireless Headphones"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your product in detail"
                                {...field}
                                className="min-h-[120px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {(categories || []).map(
                                  (category: ProductCategory) => (
                                    <SelectItem
                                      key={category.id}
                                      value={category.id} // Use category ID instead of slug
                                    >
                                      {category.name}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Pricing & Inventory</CardTitle>
                        <CardDescription>
                          Set your product&apos;s pricing and stock information.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Base Price ($)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This will be the default price for all variants
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="stock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Base Stock</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" {...field} />
                              </FormControl>
                              <FormDescription>
                                This will be used if no variants are defined
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="sku"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                              <FormControl>
                                <Input placeholder="PROD-001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                        <CardDescription>
                          Add images for your product.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <FormItem>
                          <div className="flex flex-wrap gap-4 mt-4">
                            <div>
                              <input
                                type="file"
                                id="image-upload"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                              <label
                                htmlFor="image-upload"
                                className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-400 rounded cursor-pointer hover:bg-gray-100"
                              >
                                <span className="text-4xl text-gray-400">
                                  +
                                </span>
                              </label>
                            </div>

                            {images.map((img, index) => (
                              <div key={index} className="relative w-32 h-32">
                                <Image
                                  src={img.preview}
                                  alt={`Preview ${index}`}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded"
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                                  onClick={() => handleRemoveImage(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attributes" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Product Attributes</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateVariants}
                        disabled={
                          isGeneratingVariants || attributes.length === 0
                        }
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        Generate Variants
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Add attributes like size, color, material, etc.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AttributeEditor
                      attributes={attributes}
                      onChange={setAttributes}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="variants" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Product Variants</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateVariants}
                        disabled={isGeneratingVariants}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Set custom pricing and stock for each variant combination.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {variants.length > 0 ? (
                      <ProductVariantsTable
                        variants={variants}
                        onChange={handleVariantChange}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">
                          No variants generated yet. Add attributes and click
                          &quot;Generate Variants&quot; to create them.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setActiveTab("attributes")}
                        >
                          Go to Attributes
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/products")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddProduct;
