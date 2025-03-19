"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Save, ArrowLeft, Tag, Pencil } from "lucide-react";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AttributeEditor,
  AttributeValue,
  ProductAttribute,
} from "../attributes-editor";
import { useRouter } from "next/navigation";
import { ProductVariantsTable } from "../attribute-table";
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
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional(),
});

// Categories for the select dropdown
const categories = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Outdoors",
  "Books",
  "Toys & Games",
  "Health & Wellness",
  "Jewelry",
  "Automotive",
];

interface Variant {
  id: string;
  combination: Record<string, AttributeValue>;
  price: number;
  stock: number;
  sku: string;
}

type FormValues = z.infer<typeof productFormSchema>;

const AddProduct = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isGeneratingVariants, setIsGeneratingVariants] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      sku: "",
      imageUrl: "",
    },
  });

  const basePrice = form.watch("price") || 0;

  // Generate all possible variants when attributes change
  const generateVariants = () => {
    setIsGeneratingVariants(true);

    // Check if there are any attributes with values
    const attributesWithValues = attributes.filter(
      (attr) => attr.values.length > 0
    );

    if (attributesWithValues.length === 0) {
      toast.error("Please add at least one attribute with values first");
      setIsGeneratingVariants(false);
      return;
    }

    // Helper function to generate all combinations recursively
    const generateCombinations = (
      attributes: ProductAttribute[],
      currentIndex: number,
      currentCombination: Record<string, AttributeValue> = {}
    ): Record<string, AttributeValue>[] => {
      // Base case: we've gone through all attributes
      if (currentIndex === attributes.length) {
        return [currentCombination];
      }

      const currentAttribute = attributes[currentIndex];
      const combinations: Record<string, AttributeValue>[] = [];

      // Skip attributes with no values
      if (currentAttribute.values.length === 0) {
        return generateCombinations(
          attributes,
          currentIndex + 1,
          currentCombination
        );
      }

      // For each possible value of the current attribute
      currentAttribute.values.forEach((value) => {
        // Create a new combination with this value
        const newCombination = {
          ...currentCombination,
          [currentAttribute.name]: value,
        };

        // Recursively generate combinations for the remaining attributes
        const newCombinations = generateCombinations(
          attributes,
          currentIndex + 1,
          newCombination
        );

        combinations.push(...newCombinations);
      });

      return combinations;
    };

    // Generate all possible combinations
    const combinations = generateCombinations(attributesWithValues, 0);

    // Create variant objects for each combination
    const newVariants = combinations.map((combination, index) => {
      // Check if this combination already exists in our variants
      const existingVariant = variants.find((v) => {
        // Check if the keys and values match
        const combinationKeys = Object.keys(combination);
        const variantKeys = Object.keys(v.combination);

        if (combinationKeys.length !== variantKeys.length) return false;

        return combinationKeys.every((key) => {
          return (
            v.combination[key] && v.combination[key].id === combination[key].id
          );
        });
      });

      // If it exists, keep its current price and stock
      if (existingVariant) {
        return existingVariant;
      }

      // Create a combination string for SKU (e.g., "Red-Large")
      const combinationStr = Object.values(combination)
        .map((v) => v.value)
        .join("-");

      // Create a new variant with the base price
      return {
        id: `variant-${index}-${Date.now()}`,
        combination: combination,
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

  const onSubmit = (data: FormValues) => {
    if (attributes.length > 0 && variants.length === 0) {
      toast.warning(
        "You have attributes but haven't generated variants. Please generate variants first."
      );
      return;
    }

    const product = {
      ...data,
      attributes,
      variants: variants.length > 0 ? variants : undefined,
    };

    console.log("Submitting product:", product);

    // Here you would normally send the data to your API
    // For now, we'll just simulate success
    toast.success("Product created successfully!");

    // Navigate back to products page
    setTimeout(() => {
      router.push("/products");
    }, 1500);
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
    <div className="min-h-screen bg-background ">
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
            onClick={() => router.push("/admin/products")}
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
                                {categories.map((category) => (
                                  <SelectItem
                                    key={category}
                                    value={category.toLowerCase()}
                                  >
                                    {category}
                                  </SelectItem>
                                ))}
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
                        <CardTitle>Product Image</CardTitle>
                        <CardDescription>
                          Add an image for your product.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://example.com/image.jpg"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                              {field.value && (
                                <div className="mt-2 border rounded-md overflow-hidden aspect-square w-full max-w-[200px]">
                                  <img
                                    src={field.value}
                                    alt="Product preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // Handle image loading error
                                      (e.target as HTMLImageElement).src =
                                        "https://placehold.co/400x400/FAFAFA/AAAAAA?text=Image+Error";
                                    }}
                                  />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
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
                      Add attributes like size, color, material, etc. These will
                      be used to generate product variants.
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
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Product
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddProduct;
