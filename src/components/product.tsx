import { useState } from "react";
import { Star, StarHalf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const SIZES = ["XS", "S", "M", "L", "XL"];

const COLORS = [
  {
    name: "Midnight Black",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&fit=crop",
  },
  {
    name: "Arctic White",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&fit=crop",
  },
  {
    name: "Ocean Blue",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&fit=crop",
  },
];

const REVIEWS = [
  {
    id: 1,
    author: "Sarah M.",
    rating: 5,
    date: "2 weeks ago",
    content:
      "Absolutely love this product. The quality is outstanding and it fits perfectly.",
    helpful: 24,
  },
  {
    id: 2,
    author: "James R.",
    rating: 4.5,
    date: "1 month ago",
    content: "Great design and comfortable fit. Would definitely recommend.",
    helpful: 18,
  },
  {
    id: 3,
    author: "Emma L.",
    rating: 5,
    date: "2 months ago",
    content:
      "Perfect fit and exactly what I was looking for. The color is beautiful in person.",
    helpful: 15,
  },
];

const ProductPage = () => {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[2]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-4 h-4 fill-primary" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="w-4 h-4 fill-primary" />);
    }

    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-6">
          <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/20">
            <img
              src={selectedColor.image}
              alt={selectedColor.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`color-option ${
                  selectedColor.name === color.name ? "selected" : ""
                }`}
              >
                <img
                  src={color.image}
                  alt={color.name}
                  className="product-image"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <Badge className="bg-secondary text-secondary-foreground">
              New Arrival
            </Badge>
            <h1 className="text-4xl font-medium">Premium Product</h1>
            <p className="text-2xl font-medium">$199.99</p>
            <p className="text-muted-foreground">
              Experience ultimate comfort and style with our premium product,
              crafted with the finest materials.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Color - {selectedColor.name}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`color-option ${
                    selectedColor.name === color.name ? "selected" : ""
                  }`}
                >
                  <img
                    src={color.image}
                    alt={color.name}
                    className="product-image"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Size</h3>
            <div className="flex flex-wrap gap-3">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`size-option ${
                    selectedSize === size ? "selected" : ""
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full" size="lg">
            Add to Cart
          </Button>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Reviews Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">Customer Reviews</h2>
          <div className="flex items-center space-x-2">
            <div className="star-rating">{renderStars(4.8)}</div>
            <span className="text-muted-foreground">4.8 out of 5</span>
          </div>
        </div>

        <ScrollArea className="h-[600px] rounded-lg">
          <div className="grid gap-6">
            {REVIEWS.map((review) => (
              <Card key={review.id} className="review-card">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{review.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {review.date}
                      </p>
                    </div>
                    <div className="star-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.content}</p>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Helpful ({review.helpful})
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ProductPage;
