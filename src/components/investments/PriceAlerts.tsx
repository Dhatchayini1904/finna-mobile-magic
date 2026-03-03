import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Check, Loader2 } from "lucide-react";
import { usePriceAlerts, PriceAlert } from "@/hooks/usePriceAlerts";
import { useWatchlist } from "@/hooks/useWatchlist";
import { cn } from "@/lib/utils";

export function PriceAlerts() {
  const { alerts, loading, createAlert, deleteAlert } = usePriceAlerts();
  const { watchlist } = useWatchlist();
  const [open, setOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!selectedSymbol || !targetPrice) return;
    
    const stock = watchlist.find(w => w.symbol === selectedSymbol);
    if (!stock) return;
    
    setCreating(true);
    await createAlert({
      symbol: selectedSymbol,
      name: stock.name,
      target_price: parseFloat(targetPrice),
      alert_type: alertType,
    });
    setCreating(false);
    setOpen(false);
    setSelectedSymbol('');
    setTargetPrice('');
  };

  const activeAlerts = alerts.filter(a => !a.is_triggered);
  const triggeredAlerts = alerts.filter(a => a.is_triggered);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Price Alerts</CardTitle>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Price Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Stock</Label>
                <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select from watchlist" />
                  </SelectTrigger>
                  <SelectContent>
                    {watchlist.map(stock => (
                      <SelectItem key={stock.id} value={stock.symbol}>
                        {stock.symbol} - {stock.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {watchlist.length === 0 && (
                  <p className="text-xs text-muted-foreground">Add stocks to your watchlist first</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Alert Type</Label>
                <Select value={alertType} onValueChange={(v) => setAlertType(v as 'above' | 'below')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Price goes above</SelectItem>
                    <SelectItem value="below">Price goes below</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Target Price (₹)</Label>
                <Input
                  type="number"
                  placeholder="Enter target price"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleCreate} 
                className="w-full"
                disabled={!selectedSymbol || !targetPrice || creating}
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Alert
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No price alerts set</p>
            <p className="text-xs">Create alerts to get notified when stocks hit your target prices</p>
          </div>
        ) : (
          <>
            {activeAlerts.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active</p>
                {activeAlerts.map(alert => (
                  <AlertItem key={alert.id} alert={alert} onDelete={deleteAlert} />
                ))}
              </div>
            )}
            
            {triggeredAlerts.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Triggered</p>
                {triggeredAlerts.slice(0, 3).map(alert => (
                  <AlertItem key={alert.id} alert={alert} onDelete={deleteAlert} />
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function AlertItem({ alert, onDelete }: { alert: PriceAlert; onDelete: (id: string) => void }) {
  const isAbove = alert.alert_type === 'above';
  
  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg border",
      alert.is_triggered ? "bg-success/10 border-success/30" : "bg-secondary/50 border-border/50"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-full",
          isAbove ? "bg-success/20" : "bg-destructive/20"
        )}>
          {isAbove ? (
            <TrendingUp className={cn("h-4 w-4", alert.is_triggered ? "text-success" : "text-success")} />
          ) : (
            <TrendingDown className={cn("h-4 w-4", alert.is_triggered ? "text-success" : "text-destructive")} />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{alert.symbol}</span>
            {alert.is_triggered && (
              <Badge variant="outline" className="bg-success/20 text-success border-success/30 text-xs">
                <Check className="h-3 w-3 mr-1" />
                Triggered
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isAbove ? 'Above' : 'Below'} ₹{alert.target_price.toLocaleString()}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onDelete(alert.id)}>
        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
      </Button>
    </div>
  );
}
