type ratingprops = {
  rating: number;
  long: boolean | undefined;
};
export default function Rating({ rating, long = true }: ratingprops) {
  if (!long)
    return (
      <div className="flex items-center">
        <Filled />
      </div>
    );
  if (rating === 0) {
    return (
      <div className="flex items-center">
        <NotFilled />
        <NotFilled />
        <NotFilled />
        <NotFilled />
        <NotFilled />
      </div>
    );
  }

  if (rating > 0 && rating < 1) {
    return (
      <div className="flex items-center">
        <HalfFilled />
        <NotFilled />
        <NotFilled />
        <NotFilled />
        <NotFilled />
      </div>
    );
  }

  if (rating >= 1 && rating < 1.5) {
    return (
      <div className="flex items-center">
        <Filled />
        <NotFilled />
        <NotFilled />
        <NotFilled />
        <NotFilled />
      </div>
    );
  }

  if (rating >= 1.5 && rating < 2) {
    return (
      <div className="flex items-center">
        <Filled />
        <HalfFilled />
        <NotFilled />
        <NotFilled />
        <NotFilled />
      </div>
    );
  }

  if (rating >= 2 && rating < 2.5) {
    return (
      <div className="flex items-center">
        <Filled />
        <Filled />
        <NotFilled />
        <NotFilled />
        <NotFilled />
      </div>
    );
  }

  if (rating >= 2.5 && rating < 3) {
    return (
      <div className="flex items-center">
        <Filled />
        <Filled />
        <HalfFilled />
        <NotFilled />
        <NotFilled />
      </div>
    );
  }

  if (rating >= 3 && rating < 3.5) {
    return (
      <div className="flex items-center">
        <Filled />
        <Filled />
        <Filled />
        <NotFilled />
        <NotFilled />
      </div>
    );
  }

  if (rating >= 3.5 && rating < 4) {
    return (
      <div className="flex items-center">
        <Filled />
        <Filled />
        <Filled />
        <HalfFilled />
        <NotFilled />
      </div>
    );
  }

  if (rating >= 4 && rating < 4.5) {
    return (
      <div className="flex items-center">
        <Filled />
        <Filled />
        <Filled />
        <Filled />
        <NotFilled />
      </div>
    );
  }

  if (rating >= 4.5 && rating < 5) {
    return (
      <div className="flex items-center">
        <Filled />
        <Filled />
        <Filled />
        <Filled />
        <HalfFilled />
      </div>
    );
  }

  if (rating === 5) {
    return (
      <div className="flex items-center">
        <Filled />
        <Filled />
        <Filled />
        <Filled />
        <Filled />
      </div>
    );
  }
}

const NotFilled = () => (
  <svg
    className="w-4 h-4 text-primary ms-1"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill={"gray"}
    viewBox="0 0 22 20"
  >
    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
  </svg>
);

const Filled = () => (
  <svg
    className="w-4 h-4 text-primary ms-1"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill={"currentColor"}
    viewBox="0 0 22 20"
  >
    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
  </svg>
);

const HalfFilled = () => (
  <svg
    className="w-4 h-4 text-primary ms-1"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill={"currentColor"}
    viewBox="0 0 22 20"
  >
    <path d="M12 15.968l4.247 2.377-.949-4.773 3.573-3.305-4.833-.573L12 5.275v10.693zm0 2.292l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928L12 18.26z" />
  </svg>
);
