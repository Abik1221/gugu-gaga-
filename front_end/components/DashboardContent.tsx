import { MetricsGrid } from "./MetricsGrid";
import { ChartSection } from "./ChartSection";
import { RecentActivity } from "./RecentActivity";

export function DashboardContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-neutral-900 mb-2">Dashboard</h1>
        <p className="text-neutral-600">Welcome back! Here's what's happening today.</p>
      </div>
      
      <MetricsGrid />
      <ChartSection />
      <RecentActivity />
    </div>
  );
}
