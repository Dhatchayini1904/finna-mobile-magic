import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const upcomingBills = [
  { name: "Netflix", amount: 649, daysLeft: 2, color: "bg-red-500" },
  { name: "Electricity", amount: 2800, daysLeft: 4, color: "bg-amber-500" },
  { name: "Internet", amount: 999, daysLeft: 5, color: "bg-blue-500" },
  { name: "Gym", amount: 1500, daysLeft: 7, color: "bg-purple-500" },
];

export function UpcomingBills() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming This Week
        </CardTitle>
        <Button variant="ghost" size="sm">View Calendar</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingBills.map((bill) => (
          <div
            key={bill.name}
            className="flex items-center justify-between p-3 rounded-lg bg-background/50"
          >
            <div className="flex items-center gap-3">
              <div className={`w-1 h-10 rounded-full ${bill.color}`} />
              <div>
                <p className="font-medium">{bill.name}</p>
                <p className="text-sm text-muted-foreground">
                  Due in {bill.daysLeft} day{bill.daysLeft > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <p className="font-semibold">₹{bill.amount.toLocaleString()}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
