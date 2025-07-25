import { Card, CardContent } from "./ui/card";
import { cn } from "../lib/utils";

export function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  className,
  trend,
  trendValue,
}) {
  return (
    <Card
      className={cn(
        "bg-white border border-gray-200 shadow-sm rounded-2xl",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trendValue && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend === "up" && "text-green-500",
                    trend === "down" && "text-red-500",
                    trend === "neutral" && "text-gray-400"
                  )}
                >
                  {trend === "up" && "↗"} {trend === "down" && "↘"} {trendValue}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
