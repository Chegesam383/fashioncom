import { PackageOpen } from "lucide-react";
import React from "react";

type EmptyProps = {
  icon?: React.ReactNode;
  whatsEmpty: string;
};

const Empty = ({
  icon = <PackageOpen className="h-12 w-12" />,
  whatsEmpty,
}: EmptyProps) => {
  return (
    <div className=" flex flex-col gap-4 justify-center items-center  h-[40vh]">
      <div>{icon}</div>
      <h2 className="text-xl text-muted-foreground">No {whatsEmpty} found!</h2>
    </div>
  );
};

export default Empty;
