import { Card, CardContent } from "./ui/card";
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Activity } from "lucide-react";

const metrics = [
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "2,345",
    change: "+15.3%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "-3.2%",
    trend: "down",
    icon: ShoppingCart,
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "+8.1%",
    trend: "up",
    icon: Activity,
  },
];

export function MetricsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
        
        return (
          <Card key={metric.title} className="border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-neutral-600" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <TrendIcon className="w-4 h-4" />
                  <span>{metric.change}</span>
                </div>
              </div>
              <div>
                <p className="text-neutral-600 text-sm mb-1">{metric.title}</p>
                <p className="text-neutral-900">{metric.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
