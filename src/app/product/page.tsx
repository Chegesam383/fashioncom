import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-6xl font-bold  mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
        Page Not Found
      </h2>
      <p className="text-muted-foreground mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary text-white dark:text-black rounded-xl"
      >
        Return Home
      </Link>
    </div>
  );
}
