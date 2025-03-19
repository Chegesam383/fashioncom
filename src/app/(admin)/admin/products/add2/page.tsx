"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Define the form schema with zod
const formSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  description: z.string().optional(),
});

export default function AddProductForm() {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // Store File objects instead of URLs

  // Initialize the form with react-hook-form and zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Filter out duplicates based on file name
    const newFiles = Array.from(files).filter(
      (file) =>
        !uploadedFiles.some((existingFile) => existingFile.name === file.name)
    );

    if (newFiles.length === 0) {
      alert("All selected files are duplicates.");
      return;
    }

    // Generate previews for new files and append to existing previews
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Append new files to the existing list
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const productData = {
      ...values,
      images: uploadedFiles, // Log the File objects
    };

    // Console log the product data
    console.log("Product Data:", productData);
    console.log("Name:", productData.name);
    console.log("Description:", productData.description);
    console.log("Images:", productData.images); // Array of File objects
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter product description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Uploader */}
        <FormItem>
          <FormLabel>Images</FormLabel>
          <div className="flex flex-wrap gap-4">
            {/* Uploader */}
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
                <span className="text-4xl text-gray-400">+</span>
              </label>
            </div>

            {/* Previews */}
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative w-32 h-32">
                <Image
                  src={preview}
                  alt={`Preview ${index}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                  onLoad={() => URL.revokeObjectURL(preview)}
                />
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Add Product
        </Button>
      </form>
    </Form>
  );
}
