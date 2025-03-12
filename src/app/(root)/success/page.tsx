import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { use } from "react";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent?: string; session_id?: string }>;
}) {
  const resolvedParams = use(searchParams);
  const paymentId =
    resolvedParams.payment_intent || resolvedParams.session_id || "Unknown";

  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center">Order Confirmed!</CardTitle>
          <CardDescription className="text-center">
            Thank you for your purchase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Your payment has been processed successfully.
          </p>
          <div className="mt-6 border rounded-md p-4 bg-slate-50 dark:bg-slate-800">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-medium">{paymentId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Return to Store</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
