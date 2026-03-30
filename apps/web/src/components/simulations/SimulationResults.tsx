import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SimulationDataPoint {
  t: number;
  x: number;
  v: number;
  theta: number;
  omega: number;
}

interface SimulationResultsProps {
  data: SimulationDataPoint[];
  title?: string;
}

export function SimulationResults({ data, title = 'Simulation Results' }: SimulationResultsProps) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No simulation data to display</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-bold">{title}</h2>

      {/* Position vs Time */}
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-semibold mb-4">Position vs Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="t" label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: 'Position (m)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="x" stroke="#8884d8" name="Position (x)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Velocity vs Time */}
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-semibold mb-4">Velocity vs Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="t" label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: 'Velocity (m/s)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="v" stroke="#82ca9d" name="Velocity (v)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Angle vs Time */}
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-semibold mb-4">Pendulum Angle vs Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="t" label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: 'Angle (rad)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="theta" stroke="#ffc658" name="Angle (θ)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Angular Velocity vs Time */}
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-semibold mb-4">Angular Velocity vs Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="t" label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: 'Angular Velocity (rad/s)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="omega" stroke="#ff7c7c" name="Angular Velocity (ω)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* All variables together */}
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-semibold mb-4">All Variables</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="t" label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="x" stroke="#8884d8" name="x" strokeWidth={1.5} />
            <Line type="monotone" dataKey="v" stroke="#82ca9d" name="v" strokeWidth={1.5} />
            <Line type="monotone" dataKey="theta" stroke="#ffc658" name="θ" strokeWidth={1.5} />
            <Line type="monotone" dataKey="omega" stroke="#ff7c7c" name="ω" strokeWidth={1.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
