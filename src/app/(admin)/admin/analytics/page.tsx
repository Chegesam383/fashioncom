import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
} from "lucide-react";

// // Sample data for charts
// const dailySalesData = [
//   { date: "Mon", sales: 1200, orders: 14 },
//   { date: "Tue", sales: 1800, orders: 21 },
//   { date: "Wed", sales: 1500, orders: 17 },
//   { date: "Thu", sales: 2100, orders: 25 },
//   { date: "Fri", sales: 2400, orders: 28 },
//   { date: "Sat", sales: 1900, orders: 22 },
//   { date: "Sun", sales: 1300, orders: 15 },
// ];

// const monthlySalesData = [
//   { month: "Jan", sales: 12000, orders: 142 },
//   { month: "Feb", sales: 19000, orders: 186 },
//   { month: "Mar", sales: 22000, orders: 215 },
//   { month: "Apr", sales: 25000, orders: 232 },
//   { month: "May", sales: 27000, orders: 256 },
//   { month: "Jun", sales: 29000, orders: 270 },
// ];

// const trafficSourceData = [
//   { name: "Direct", value: 40 },
//   { name: "Organic", value: 25 },
//   { name: "Referral", value: 15 },
//   { name: "Social", value: 20 },
// ];

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

// const categoryPerformanceData = [
//   { name: "Electronics", sales: 35000, profit: 15000 },
//   { name: "Clothing", sales: 28000, profit: 12000 },
//   { name: "Home", sales: 18000, profit: 7500 },
//   { name: "Beauty", sales: 12000, profit: 5000 },
//   { name: "Sports", sales: 9000, profit: 3800 },
// ];

// Stats cards data
const statsCards = [
  {
    title: "Total Revenue",
    value: "$142,384",
    change: "+12.3%",
    trend: "up",
    description: "Compared to last month",
    icon: DollarSign,
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "Orders",
    value: "1,258",
    change: "+5.4%",
    trend: "up",
    description: "Compared to last month",
    icon: ShoppingBag,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "-0.8%",
    trend: "down",
    description: "Compared to last month",
    icon: TrendingUp,
    color: "bg-red-500/10 text-red-500",
  },
  {
    title: "Active Users",
    value: "8,942",
    change: "+7.1%",
    trend: "up",
    description: "Compared to last month",
    icon: Users,
    color: "bg-purple-500/10 text-purple-500",
  },
];

// Analytics page component
const Analytics = () => {
  return (
    <div className="min-h-screen bg-background ">
      <div className="space-y-8 ">
        <div className="flex flex-col space-y-2">
          <h1 className="font-bold text-3xl">Analytics</h1>
          <p className="text-muted-foreground">
            Track your eCommerce performance with detailed insights and metrics.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs flex items-center mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span
                    className={
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    {stat.description}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Tabs defaultValue="day" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="day">Daily</TabsTrigger>
              <TabsTrigger value="week">Weekly</TabsTrigger>
              <TabsTrigger value="month">Monthly</TabsTrigger>
              <TabsTrigger value="year">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <select className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
