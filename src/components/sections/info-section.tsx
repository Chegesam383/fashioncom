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
    className={`flex items-center p-6 rounded-lg shadow transition-transform hover:scale-105 ${bgColor}`}
  >
    <div className="text-4xl mr-4">
      <Icon className={color} />
    </div>
    <div>
      <h3 className={`text-lg font-semibold ${color} mb-1`}>{title}</h3>
      <p className={`text-sm ${color}`}>{description}</p>
    </div>
  </div>
);

export default function InfoSection() {
  return (
    <section className="py-8 bg-muted/70">
      <div className="lg:container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <InfoItem
            icon={Truck}
            title="Free Shipping"
            description="On orders over $20"
            bgColor="bg-purple-200/70"
            color="text-purple-950"
          />
          <InfoItem
            icon={RotateCcw}
            title="30 Days Return"
            description="Money back guarantee"
            bgColor="bg-pink-200/70"
            color="text-pink-950"
          />
          <InfoItem
            icon={ShieldCheck}
            title="Secure Payments"
            description="100% protected transactions"
            bgColor="bg-red-200/70"
            color="text-red-950"
          />
        </div>
      </div>
    </section>
  );
}
