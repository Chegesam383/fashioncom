import type React from "react";
import ProfileSidebar from "./_components/profile_sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-2 lg:container mx-auto overflow-x-hidden">
      <div className="md:flex min-h-screen">
        <ProfileSidebar />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
