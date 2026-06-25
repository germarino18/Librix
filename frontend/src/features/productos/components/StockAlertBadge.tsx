import { cn } from "@/shared/utils/cn"

interface StockAlertBadgeProps {
  stockActual: number
  stockMinimo: number
}

export function StockAlertBadge({ stockActual, stockMinimo }: StockAlertBadgeProps) {
  const isCritical = stockActual < stockMinimo
  const isWarning = stockActual <= stockMinimo * 1.5

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        isCritical && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        isWarning && !isCritical && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        !isWarning && "bg-muted text-muted-foreground",
      )}
    >
      {stockActual}
    </span>
  )
}
