import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { month: 'Jul', imports: 420, exports: 380, transit: 120 },
  { month: 'Aug', imports: 480, exports: 420, transit: 145 },
  { month: 'Sep', imports: 520, exports: 390, transit: 130 },
  { month: 'Oct', imports: 590, exports: 480, transit: 160 },
  { month: 'Nov', imports: 650, exports: 520, transit: 180 },
  { month: 'Dec', imports: 720, exports: 580, transit: 210 },
  { month: 'Jan', imports: 680, exports: 540, transit: 195 },
];

export function ShipmentChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-foreground">Shipment Trends</h3>
          <p className="text-sm text-muted-foreground">Last 7 months activity</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-accent" />
            <span className="text-sm text-muted-foreground">Imports</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-success" />
            <span className="text-sm text-muted-foreground">Exports</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-pending" />
            <span className="text-sm text-muted-foreground">Transit</span>
          </div>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorImports" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExports" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTransit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(262 83% 58%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(262 83% 58%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 25% 90%)" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(215 16% 47%)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(215 16% 47%)', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0 0% 100%)',
                border: '1px solid hsl(215 25% 90%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="imports"
              stroke="hsl(199 89% 48%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorImports)"
            />
            <Area
              type="monotone"
              dataKey="exports"
              stroke="hsl(142 76% 36%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExports)"
            />
            <Area
              type="monotone"
              dataKey="transit"
              stroke="hsl(262 83% 58%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTransit)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
