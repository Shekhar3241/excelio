import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { ChevronLeft, ChevronRight, Plus, Copy, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Habit {
  id: string;
  name: string;
  completedDays: number[];
}

interface HabitData {
  [monthKey: string]: Habit[];
}

const HabitTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState<HabitData>({});
  const [newHabitName, setNewHabitName] = useState("");

  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  const currentHabits = habits[monthKey] || [];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("habitTrackerData");
    if (saved) {
      setHabits(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("habitTrackerData", JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      completedDays: [],
    };
    setHabits((prev) => ({
      ...prev,
      [monthKey]: [...(prev[monthKey] || []), newHabit],
    }));
    setNewHabitName("");
  };

  const toggleDay = (habitId: string, day: number) => {
    setHabits((prev) => ({
      ...prev,
      [monthKey]: (prev[monthKey] || []).map((habit) => {
        if (habit.id !== habitId) return habit;
        const hasDay = habit.completedDays.includes(day);
        return {
          ...habit,
          completedDays: hasDay
            ? habit.completedDays.filter((d) => d !== day)
            : [...habit.completedDays, day],
        };
      }),
    }));
  };

  const deleteHabit = (habitId: string) => {
    setHabits((prev) => ({
      ...prev,
      [monthKey]: (prev[monthKey] || []).filter((h) => h.id !== habitId),
    }));
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const copyFromPrevious = () => {
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const prevKey = `${prevMonth.getFullYear()}-${prevMonth.getMonth()}`;
    const prevHabits = habits[prevKey] || [];
    if (prevHabits.length > 0) {
      const copiedHabits = prevHabits.map((h) => ({
        ...h,
        id: Date.now().toString() + Math.random(),
        completedDays: [],
      }));
      setHabits((prev) => ({
        ...prev,
        [monthKey]: [...(prev[monthKey] || []), ...copiedHabits],
      }));
    }
  };

  // Calculate stats
  const totalPossible = currentHabits.length * daysInMonth;
  const totalCompleted = currentHabits.reduce(
    (sum, h) => sum + h.completedDays.length,
    0
  );
  const progressPercent = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;

  const today = new Date().getDate();
  const todayCompleted = currentHabits.filter((h) =>
    h.completedDays.includes(today)
  ).length;
  const todayPercent =
    currentHabits.length > 0 ? (todayCompleted / currentHabits.length) * 100 : 0;

  // Weekly data for charts
  const getWeekData = () => {
    const weeks = [];
    for (let w = 0; w < 5; w++) {
      const startDay = w * 7 + 1;
      const endDay = Math.min((w + 1) * 7, daysInMonth);
      const daysInWeek = endDay - startDay + 1;
      let completed = 0;
      let total = currentHabits.length * daysInWeek;
      currentHabits.forEach((h) => {
        h.completedDays.forEach((d) => {
          if (d >= startDay && d <= endDay) completed++;
        });
      });
      weeks.push({
        name: `Week ${w + 1}`,
        completed,
        total,
        percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      });
    }
    return weeks;
  };

  const weekData = getWeekData();

  // Daily progress line chart data
  const getDailyData = () => {
    const data = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const completed = currentHabits.filter((h) =>
        h.completedDays.includes(d)
      ).length;
      const percent =
        currentHabits.length > 0
          ? Math.round((completed / currentHabits.length) * 100)
          : 0;
      data.push({ day: d, percent });
    }
    return data;
  };

  const dailyData = getDailyData();

  // Top habits
  const topHabits = [...currentHabits]
    .sort((a, b) => b.completedDays.length - a.completedDays.length)
    .slice(0, 10);

  const pieData = [
    { name: "Completed", value: todayPercent },
    { name: "Remaining", value: 100 - todayPercent },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a1a] via-[#0d2020] to-[#0a1a1a] text-white">
      <Helmet>
        <title>Habit Tracker | ConvertX</title>
        <meta name="description" content="Track your daily habits and build consistency" />
      </Helmet>

      {/* Header */}
      <header className="border-b border-emerald-900/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-emerald-400">Habit Tracker</h1>
          <nav className="flex gap-4 text-sm text-gray-400">
            <a href="/" className="hover:text-emerald-400 transition-colors">Home</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Month Navigation */}
        <div className="bg-[#111c1c] rounded-xl p-6 border border-emerald-900/30">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth(-1)}
              className="text-gray-400 hover:text-emerald-400"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-semibold text-white">{monthName}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth(1)}
              className="text-gray-400 hover:text-emerald-400"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#0a1414] rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase">Number of Habits</p>
              <p className="text-3xl font-bold text-white">{currentHabits.length}</p>
            </div>
            <div className="bg-[#0a1414] rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase">Completed Habits</p>
              <p className="text-3xl font-bold text-white">{totalCompleted}</p>
            </div>
            <div className="bg-[#0a1414] rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase">Progress</p>
              <div className="flex items-center gap-2">
                <Progress value={progressPercent} className="h-3 flex-1 bg-gray-700" />
                <span className="text-emerald-400 font-bold">{Math.round(progressPercent)}%</span>
              </div>
            </div>
          </div>

          {/* Add Habit */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Add a new habit..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addHabit()}
              className="flex-1 bg-[#0a1414] border-emerald-900/50 text-white placeholder:text-gray-500"
            />
            <Button onClick={addHabit} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
            <Button variant="outline" onClick={copyFromPrevious} className="border-emerald-900/50 text-gray-300 hover:bg-emerald-900/20">
              <Copy className="h-4 w-4 mr-1" /> Copy from Previous Month
            </Button>
            <Button variant="outline" className="border-emerald-900/50 text-gray-300 hover:bg-emerald-900/20">
              <Calendar className="h-4 w-4 mr-1" /> Monthly View
            </Button>
          </div>

          {/* Habit Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs">
                  <th className="text-left py-2 px-2 min-w-[150px]">My Habits</th>
                  {Array.from({ length: daysInMonth }, (_, i) => (
                    <th
                      key={i + 1}
                      className={`w-8 text-center ${
                        i + 1 === today ? "text-emerald-400" : ""
                      }`}
                    >
                      {i + 1}
                    </th>
                  ))}
                  <th className="w-12 text-center">%</th>
                </tr>
              </thead>
              <tbody>
                {currentHabits.map((habit) => {
                  const habitPercent = Math.round(
                    (habit.completedDays.length / daysInMonth) * 100
                  );
                  return (
                    <tr key={habit.id} className="border-t border-emerald-900/20">
                      <td className="py-2 px-2 flex items-center gap-2">
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="text-red-500 hover:text-red-400 text-xs"
                        >
                          ×
                        </button>
                        <span className="truncate">{habit.name}</span>
                      </td>
                      {Array.from({ length: daysInMonth }, (_, i) => {
                        const day = i + 1;
                        const isCompleted = habit.completedDays.includes(day);
                        return (
                          <td key={day} className="text-center">
                            <button
                              onClick={() => toggleDay(habit.id, day)}
                              className={`w-6 h-6 rounded border transition-all ${
                                isCompleted
                                  ? "bg-emerald-500 border-emerald-400"
                                  : "bg-transparent border-gray-600 hover:border-emerald-500"
                              }`}
                            />
                          </td>
                        );
                      })}
                      <td className="text-center text-emerald-400 font-medium">
                        {habitPercent}%
                      </td>
                    </tr>
                  );
                })}
                {currentHabits.length === 0 && (
                  <tr>
                    <td
                      colSpan={daysInMonth + 2}
                      className="text-center py-8 text-gray-500"
                    >
                      No habits yet. Add your first habit above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overview Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Daily Progress Pie */}
          <div className="bg-[#111c1c] rounded-xl p-6 border border-emerald-900/30">
            <h3 className="text-sm text-gray-400 uppercase mb-4 text-center">
              Overview Daily Progress
            </h3>
            <div className="flex justify-center">
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill="#f97316" />
                      <Cell fill="#22c55e" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {Math.round(todayPercent)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-orange-500 rounded" /> Left {Math.round(100 - todayPercent)}%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-emerald-500 rounded" /> Completed {Math.round(todayPercent)}%
              </span>
            </div>
          </div>

          {/* Top Habits */}
          <div className="bg-[#111c1c] rounded-xl p-6 border border-emerald-900/30">
            <h3 className="text-sm text-gray-400 uppercase mb-4 text-center">
              Top 10 Daily Habits
            </h3>
            <div className="space-y-3">
              {topHabits.map((habit, idx) => {
                const percent = Math.round(
                  (habit.completedDays.length / daysInMonth) * 100
                );
                return (
                  <div key={habit.id} className="flex items-center gap-3">
                    <span className="text-gray-500 w-4">{idx + 1}.</span>
                    <span className="flex-1 truncate text-sm">{habit.name}</span>
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-emerald-400 text-sm w-12 text-right">
                      {percent}%
                    </span>
                  </div>
                );
              })}
              {topHabits.length === 0 && (
                <p className="text-gray-500 text-center py-4">No habits to display</p>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Charts */}
        <div className="grid grid-cols-5 gap-4">
          {weekData.map((week, idx) => (
            <div
              key={idx}
              className="bg-[#111c1c] rounded-xl p-4 border border-emerald-900/30"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{week.name}</span>
                <span className="text-xs text-gray-500">
                  {week.completed}/{week.total}
                </span>
              </div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[week]}>
                    <Bar dataKey="percent" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-emerald-400 text-sm mt-2">
                {week.percent}%
              </p>
            </div>
          ))}
        </div>

        {/* Weekly Progress Line Chart */}
        <div className="bg-[#111c1c] rounded-xl p-6 border border-emerald-900/30">
          <h3 className="text-sm text-gray-400 uppercase mb-4 text-center">
            Weekly Progress by Graph
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <XAxis dataKey="day" stroke="#4b5563" tickLine={false} />
                <YAxis stroke="#4b5563" tickLine={false} domain={[0, 100]} />
                <Line
                  type="monotone"
                  dataKey="percent"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  fill="url(#greenGradient)"
                />
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-[#111c1c] rounded-xl p-6 border border-emerald-900/30">
          <h3 className="text-sm text-gray-400 uppercase mb-4">Analytics</h3>
          <div className="space-y-4">
            {currentHabits.slice(0, 5).map((habit) => {
              const actual = habit.completedDays.length;
              const goal = daysInMonth;
              const percent = Math.round((actual / goal) * 100);
              return (
                <div key={habit.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{habit.name}</span>
                    <span className="text-gray-400">
                      Goal: {goal} | Actual: {actual}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HabitTracker;
