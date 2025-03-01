import type React from "react";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

const InfoItem = ({
  icon: Icon,
  title,
  description,
  bgColor,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  bgColor: string;
  color: string;
}) => (
  <div
    className={`flex flex-col lg:flex-row justify-center items-center py-2 px-2 rounded-lg transition-transform hover:scale-[1.02] ${bgColor}`}
  >
    <div className="text-4xl mr-4">
      <Icon className={color} />
    </div>
    <div>
      <h3
        className={`text-lg lg:text-left font-semibold ${color} mb-1 text-center`}
      >
        {title}
      </h3>
      <p className={`text-sm ${color} text-center lg:text-left`}>
        {description}
      </p>
    </div>
  </div>
);

export default function InfoSection() {
  return (
    <section className="py-6 mt-4 bg-muted/70">
      <div className="lg:container mx-auto px-4">
        <div className="grid grid-cols-3 gap-2">
          <InfoItem
            icon={Truck}
            title="Free Shipping"
            description="On orders over $20"
            bgColor="bg-purple-50"
            color="text-purple-950"
          />
          <InfoItem
            icon={RotateCcw}
            title="30 Days Return"
            description="Money back guarantee"
            bgColor="bg-pink-50"
            color="text-pink-950"
          />
          <InfoItem
            icon={ShieldCheck}
            title="Secure Payments"
            description="100% protected transactions"
            bgColor="bg-red-50"
            color="text-red-950"
          />
        </div>
      </div>
    </section>
  );
}
