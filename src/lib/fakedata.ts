export type product = {
  saleEnds: boolean;
  bestSeller: boolean;
  flashSale: boolean;
  originalPrice: number;
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  creationAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    image: string;
    creationAt: string;
    updatedAt: string;
  };
};

export type category = {
  id: string;
  name: string;
  image: string;
  creationAt: string;
  updatedAt: string;
  subcategories?: category[];
};
export const products: product[] = [
  {
    id: "43",
    title: "Change data ",
    price: 100,
    description:
      "Step into sophistication with our Elegant Purple Leather Loafers, perfect for making a bold statement. Crafted from high-quality leather with a vibrant purple finish, these shoes feature a classic loafer silhouette that's been updated with a contemporary twist. The comfortable slip-on design and durable soles ensure both style and functionality for the modern man.",
    images: [
      "https://i.imgur.com/Au8J9sX.jpeg",
      "https://i.imgur.com/gdr8BW2.jpeg",
      "https://i.imgur.com/KDCZxnJ.jpeg",
    ],
    creationAt: "2025-02-12T17:30:09.000Z",
    updatedAt: "2025-02-13T03:21:23.000Z",
    category: {
      id: "4",
      name: "Shoes",
      image: "https://i.imgur.com/qNOjJje.jpeg",
      creationAt: "2025-02-12T17:30:09.000Z",
      updatedAt: "2025-02-12T17:30:09.000Z",
    },
    saleEnds: false,
    bestSeller: false,
    flashSale: true,
    originalPrice: 30,
  },
  {
    id: "44",
    title: "Classic Blue Suede Casual",
    price: 39,
    description:
      "Step into comfort with our Classic Blue Suede Casual Shoes, perfect for everyday wear. These shoes feature a stylish blue suede upper, durable rubber soles for superior traction, and classic lace-up fronts for a snug fit. The sleek design pairs well with both jeans and chinos, making them a versatile addition to any wardrobe.",
    images: [
      "https://i.imgur.com/sC0ztOB.jpeg",
      "https://i.imgur.com/Jf9DL9R.jpeg",
      "https://i.imgur.com/R1IN95T.jpeg",
    ],
    creationAt: "2025-02-12T17:30:09.000Z",
    updatedAt: "2025-02-13T02:41:34.000Z",
    category: {
      id: "4",
      name: "Shoes",
      image: "https://i.imgur.com/qNOjJje.jpeg",
      creationAt: "2025-02-12T17:30:09.000Z",
      updatedAt: "2025-02-12T17:30:09.000Z",
    },
    saleEnds: false,
    bestSeller: false,
    flashSale: true,
    originalPrice: 30,
  },
  {
    id: "46",
    title: "Sleek All-Terrain",
    price: 37,
    description:
      "Experience the thrill of outdoor adventures with our Sleek All-Terrain Go-Kart, featuring a durable frame, comfortable racing seat, and robust, large-tread tires perfect for handling a variety of terrains. Designed for fun-seekers of all ages, this go-kart is an ideal choice for backyard racing or exploring local trails.",
    images: [
      "https://i.imgur.com/Ex5x3IU.jpg",
      "https://i.imgur.com/z7wAQwe.jpg",
      "https://i.imgur.com/kc0Dj9S.jpg",
    ],
    creationAt: "2025-02-12T17:30:09.000Z",
    updatedAt: "2025-02-13T02:46:11.000Z",
    category: {
      id: "5",
      name: "Miscellaneous",
      image: "https://i.imgur.com/BG8J0Fj.jpg",
      creationAt: "2025-02-12T17:30:09.000Z",
      updatedAt: "2025-02-12T17:30:09.000Z",
    },
    saleEnds: false,
    bestSeller: false,
    flashSale: true,
    originalPrice: 30,
  },
  {
    id: "47",
    title: "Radiant Citrus Eau data sasa",
    price: 900,
    description:
      "Indulge in the essence of summer with this vibrant citrus-scented Eau de Parfum. Encased in a sleek glass bottle with a bold orange cap, this fragrance embodies freshness and elegance. Perfect for daily wear, it's an olfactory delight that leaves a lasting, zesty impression.",
    images: [
      "https://i.imgur.com/xPDwUb3.jpg",
      "https://i.imgur.com/3rfp691.jpg",
      "https://i.imgur.com/kG05a29.jpg",
    ],
    creationAt: "2025-02-12T17:30:09.000Z",
    updatedAt: "2025-02-13T03:21:45.000Z",
    category: {
      id: "5",
      name: "Miscellaneous",
      image: "https://i.imgur.com/BG8J0Fj.jpg",
      creationAt: "2025-02-12T17:30:09.000Z",
      updatedAt: "2025-02-12T17:30:09.000Z",
    },
    saleEnds: false,
    bestSeller: false,
    flashSale: true,
    originalPrice: 30,
  },
  {
    id: "48",
    title: "Sleek Olive Green Hardshell Carry-On Luggage",
    price: 48,
    description:
      "Travel in style with our durable hardshell carry-on, perfect for weekend getaways and business trips. This sleek olive green suitcase features smooth gliding wheels for easy airport navigation, a sturdy telescopic handle, and a secure zippered compartment to keep your belongings safe. Its compact size meets most airline overhead bin requirements, ensuring a hassle-free flying experience.",
    images: [
      "https://i.imgur.com/jVfoZnP.jpg",
      "https://i.imgur.com/Tnl15XK.jpg",
      "https://i.imgur.com/7OqTPO6.jpg",
    ],
    creationAt: "2025-02-12T17:30:09.000Z",
    updatedAt: "2025-02-12T17:30:09.000Z",
    category: {
      id: "5",
      name: "Miscellaneous",
      image: "https://i.imgur.com/BG8J0Fj.jpg",
      creationAt: "2025-02-12T17:30:09.000Z",
      updatedAt: "2025-02-12T17:30:09.000Z",
    },
    saleEnds: false,
    bestSeller: false,
    flashSale: false,
    originalPrice: 30,
  },

  {
    id: "43",
    title: "Change data ",
    price: 100,
    description:
      "Step into sophistication with our Elegant Purple Leather Loafers, perfect for making a bold statement. Crafted from high-quality leather with a vibrant purple finish, these shoes feature a classic loafer silhouette that's been updated with a contemporary twist. The comfortable slip-on design and durable soles ensure both style and functionality for the modern man.",
    images: [
      "https://i.imgur.com/Au8J9sX.jpeg",
      "https://i.imgur.com/gdr8BW2.jpeg",
      "https://i.imgur.com/KDCZxnJ.jpeg",
    ],
    creationAt: "2025-02-12T17:30:09.000Z",
    updatedAt: "2025-02-13T03:21:23.000Z",
    category: {
      id: "4",
      name: "Shoes",
      image: "https://i.imgur.com/qNOjJje.jpeg",
      creationAt: "2025-02-12T17:30:09.000Z",
      updatedAt: "2025-02-12T17:30:09.000Z",
    },
    saleEnds: false,
    bestSeller: false,
    flashSale: true,
    originalPrice: 30,
  },
  {
    id: "44",
    title: "Classic Blue Suede Casual",
    price: 39,
    description:
      "Step into comfort with our Classic Blue Suede Casual Shoes, perfect for everyday wear. These shoes feature a stylish blue suede upper, durable rubber soles for superior traction, and classic lace-up fronts for a snug fit. The sleek design pairs well with both jeans and chinos, making them a versatile addition to any wardrobe.",
    images: [
      "https://i.imgur.com/sC0ztOB.jpeg",
      "https://i.imgur.com/Jf9DL9R.jpeg",
      "https://i.imgur.com/R1IN95T.jpeg",
    ],
    creationAt: "2025-02-12T17:30:09.000Z",
    updatedAt: "2025-02-13T02:41:34.000Z",
    category: {
      id: "4",
      name: "Shoes",
      image: "https://i.imgur.com/qNOjJje.jpeg",
      creationAt: "2025-02-12T17:30:09.000Z",
      updatedAt: "2025-02-12T17:30:09.000Z",
    },
    saleEnds: false,
    bestSeller: false,
    flashSale: true,
    originalPrice: 30,
  },
  {
    id: "46",
    title: "Sleek All-Terrain",
    price: 37,
    description:
      "Experience the thrill of outdoor adventures with our Sleek All-Terrain Go-Kart, featuring a durable frame, comfortable racing seat, and robust, large-tread tires perfect for handling a variety of terrains. Designed for fun-seekers of all ages, this go-kart is an ideal choice for backyard racing or exploring local trails.",
    images: [
      "https://i.imgur.com/Ex5x3IU.jpg",
      "https://i.imgur.com/z7wAQwe.jpg",
      "https://i.imgur.com/kc0Dj9S.jpg",
    ],
    creationAt: "2025-02-12T17:30:09.000Z",
    updatedAt: "2025-02-13T02:46:11.000Z",
    category: {
      id: "5",
      name: "Miscellaneous",
      image: "https://i.imgur.com/BG8J0Fj.jpg",
      creationAt: "2025-02-12T17:30:09.000Z",
      updatedAt: "2025-02-12T17:30:09.000Z",
    },
    saleEnds: false,
    bestSeller: false,
    flashSale: true,
    originalPrice: 30,
  },
  {
    id: "47",
    title: "Radiant Citrus Eau data sasa",
    price: 900,
    description:
      "Indulge in the essence of summer with this vibrant citrus-scented Eau de Parfum. Encased in a sleek glass bottle with a bold orange cap, this fragrance embodies freshness and elegance. Perfect for daily wear, it's an olfactory delight that leaves a lasting, zesty impression.",
    images: [
      "https://i.imgur.com/xPDwUb3.jpg",
      "https://i.imgur.com/3rfp691.jpg",
      "https://i.imgur.com/kG05a29.jpg",
    ],
    creationAt: "2025-02-12T17:30:09.000Z",
    updatedAt: "2025-02-13T03:21:45.000Z",
    category: {
      id: "5",
      name: "Miscellaneous",
      image: "https://i.imgur.com/BG8J0Fj.jpg",
      creationAt: "2025-02-12T17:30:09.000Z",
      updatedAt: "2025-02-12T17:30:09.000Z",
    },
    saleEnds: false,
    bestSeller: false,
    flashSale: true,
    originalPrice: 30,
  },
];

export const categories: category[] = [
  {
    id: "1",
    name: "Clothes",
    image: "https://i.imgur.com/QkIa5tT.jpeg",
    creationAt: "2025-02-16T19:10:42.000Z",
    updatedAt: "2025-02-16T19:10:42.000Z",
  },
  {
    id: "1d2",
    name: "Electronics",
    image: "https://i.imgur.com/ZANVnHE.jpeg",
    creationAt: "2025-02-16T19:10:42.000Z",
    updatedAt: "2025-02-16T19:10:42.000Z",

    subcategories: [
      {
        id: "1d2",
        name: "Phones",
        image: "https://i.imgur.com/ZANVnHE.jpeg",
        creationAt: "2025-02-16T19:10:42.000Z",
        updatedAt: "2025-02-16T19:10:42.000Z",

        subcategories: [
          {
            id: "1d2",
            name: "Phones",
            image: "https://i.imgur.com/ZANVnHE.jpeg",
            creationAt: "2025-02-16T19:10:42.000Z",
            updatedAt: "2025-02-16T19:10:42.000Z",
          },
          {
            id: "1d2",
            name: "Phones",
            image: "https://i.imgur.com/ZANVnHE.jpeg",
            creationAt: "2025-02-16T19:10:42.000Z",
            updatedAt: "2025-02-16T19:10:42.000Z",
          },
        ],
      },

      {
        id: "1d2",
        name: "Tvs",
        image: "https://i.imgur.com/ZANVnHE.jpeg",
        creationAt: "2025-02-16T19:10:42.000Z",
        updatedAt: "2025-02-16T19:10:42.000Z",
      },

      {
        id: "1d2",
        name: "Music",
        image: "https://i.imgur.com/ZANVnHE.jpeg",
        creationAt: "2025-02-16T19:10:42.000Z",
        updatedAt: "2025-02-16T19:10:42.000Z",
      },
    ],
  },
  {
    id: "1d2",
    name: "Furniture",
    image: "https://i.imgur.com/Qphac99.jpeg",
    creationAt: "2025-02-16T19:10:42.000Z",
    updatedAt: "2025-02-16T19:10:42.000Z",
  },
  {
    id: "1d2",
    name: "Shoes",
    image: "https://i.imgur.com/qNOjJje.jpeg",
    creationAt: "2025-02-16T19:10:42.000Z",
    updatedAt: "2025-02-16T19:10:42.000Z",
  },
  {
    id: "1d2",
    name: "Royal Items",
    image: "https://i.imgur.com/49FiVI0.png",
    creationAt: "2025-02-16T19:13:39.000Z",
    updatedAt: "2025-02-16T19:13:39.000Z",
  },
  {
    id: "1d2",
    name: "Sara Items",
    image: "https://i.imgur.com/49FiVI0.png",
    creationAt: "2025-02-16T20:56:10.000Z",
    updatedAt: "2025-02-16T20:56:10.000Z",
  },

  {
    id: "1d2",
    name: "New Category",
    image: "https://placeimg.com/640/480/any",
    creationAt: "2025-02-17T03:11:17.000Z",
    updatedAt: "2025-02-17T03:11:17.000Z",
  },
  {
    id: "1d2",
    name: "Books",
    image: "https://api.lorem.space/image/book?w=150&h=220",
    creationAt: "2025-02-17T03:40:28.000Z",
    updatedAt: "2025-02-17T03:40:28.000Z",
  },
  {
    id: "1d2",
    name: "MynewCategory",
    image: "https://placeimg.com/640/480/any",
    creationAt: "2025-02-17T06:02:59.000Z",
    updatedAt: "2025-02-17T06:02:59.000Z",
  },
];
