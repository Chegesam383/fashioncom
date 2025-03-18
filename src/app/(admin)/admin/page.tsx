import React from "react";
import StatsCard from "./_components/stats-card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { SalesChart } from "./_components/sales-chart";
import { SalesByCategory } from "./_components/sales-by cat-chart";
import { OrdersTable } from "./_components/recent-orders-table";
import TopSelling from "./_components/top-selling-products";
import RecentCustomers from "./_components/recent-customers";

function Page() {
  return (
    <section className="overflow-x-hidden">
      <h1 className="font-bold text-3xl ">Dashboard</h1>
      <p className="text-muted-foreground mb-4">
        Welcome back! Here&apos;s an overview of your store performance.
      </p>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="$45,231.89"
          description="Total revenue from all sales"
          icon={DollarSign}
          trend={{ value: 12.5, label: "vs. last month", positive: true }}
        />
        <StatsCard
          title="Orders"
          value="1,204"
          description="Total number of orders"
          icon={ShoppingCart}
          trend={{ value: 8.2, label: "vs. last month", positive: true }}
        />

        <StatsCard
          title="Products"
          value="385"
          description="Total number of products"
          icon={Package}
          trend={{ value: 4.3, label: "vs. last month", positive: true }}
        />

        <StatsCard
          title="Customers"
          value="5,423"
          description="Total number of customers"
          icon={Users}
          trend={{ value: 2.1, label: "vs. last month", positive: true }}
        />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 ">
        <div className="col-span-3 lg:col-span-2 ">
          <SalesChart />
        </div>
        <div className="col-span-3 lg:col-span-1 ">
          <SalesByCategory />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-4 ">
        <div className="col-span-7 lg:col-span-5">
          <OrdersTable />
        </div>
        <div className="flex flex-col gap-2 col-span-7 lg:col-span-2">
          <TopSelling />
          <RecentCustomers />
        </div>
      </div>
    </section>
  );
}

export default Page;
