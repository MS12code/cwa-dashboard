import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  className,
  trend,
  trendValue,
}: DashboardCardProps) {
  return (
    <Card
      className={cn(
        "bg-drdo-blue/50 border-drdo-blue-light backdrop-blur-sm",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-drdo-gray-light">{title}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-2xl font-bold text-white">{value}</p>
              {trendValue && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend === "up" && "text-green-400",
                    trend === "down" && "text-red-400",
                    trend === "neutral" && "text-drdo-gray-light",
                  )}
                >
                  {trend === "up" && "↗"} {trend === "down" && "↘"}{" "}
                  {trendValue}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-drdo-gray mt-1">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-drdo-blue-light/30">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
