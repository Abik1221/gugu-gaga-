import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const activities = [
  {
    id: 1,
    user: "Sarah Johnson",
    action: "completed a purchase",
    amount: "$299.00",
    time: "2 minutes ago",
    status: "success",
  },
  {
    id: 2,
    user: "Michael Chen",
    action: "created a new account",
    amount: null,
    time: "15 minutes ago",
    status: "info",
  },
  {
    id: 3,
    user: "Emma Wilson",
    action: "updated their profile",
    amount: null,
    time: "1 hour ago",
    status: "info",
  },
  {
    id: 4,
    user: "David Brown",
    action: "completed a purchase",
    amount: "$149.00",
    time: "2 hours ago",
    status: "success",
  },
  {
    id: 5,
    user: "Lisa Anderson",
    action: "requested a refund",
    amount: "$89.00",
    time: "3 hours ago",
    status: "warning",
  },
];

const statusColors = {
  success: "bg-green-100 text-green-700 border-green-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
};

export function RecentActivity() {
  return (
    <Card className="border-neutral-200">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-neutral-900 truncate">
                    <span>{activity.user}</span>{" "}
                    <span className="text-neutral-600">{activity.action}</span>
                  </p>
                  <p className="text-neutral-500 text-sm">{activity.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {activity.amount && (
                  <span className="text-neutral-900">{activity.amount}</span>
                )}
                <Badge
                  variant="outline"
                  className={statusColors[activity.status as keyof typeof statusColors]}
                >
                  {activity.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
