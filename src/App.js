import React, { useState, useEffect } from 'react';
import './App.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function App() {
  const [monthly, setMonthly] = useState(20000);
  const [goal, setGoal] = useState(1000000);
  const [interestRate, setInterestRate] = useState(10);
  const [years, setYears] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    calculateYears();
  }, [monthly, goal, interestRate]);

  const calculateYears = () => {
    let total = 0;
    let year = 0;
    let rate = interestRate / 100;
    let data = [];

    while (total < goal && year < 100) {
      total = (total + monthly * 12) * (1 + rate);
      data.push({ year: year + 1, amount: Math.round(total) });
      year++;
    }
    setYears(year);
    setChartData(data);
  };

  return (
    <div className="container">
      <h1>Финансовый калькулятор</h1>
      <div className="input-group">
        <label>Ежемесячные накопления (₽):</label>
        <input
          type="number"
          value={monthly}
          onChange={(e) => setMonthly(Number(e.target.value))}
        />
      </div>
      <div className="input-group">
        <label>Доходность вложений (% годовых):</label>
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(Number(e.target.value))}
        />
      </div>
      <div className="input-group">
        <label>Стоимость цели (₽):</label>
        <input
          id="goal"
          type="number"
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
        />
      </div>
      <div className="result">
        <p>Вы достигнете цели за {years} {years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}</p>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12 }}
              tickFormatter={(tick) => `${tick} г.`}
              interval={screenWidth < 500 ? 4 : 0}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(tick) => formatNumber(tick)}
              width={80}
            />
            <Tooltip
              formatter={(value) => formatNumber(value) + ' ₽'}
              labelFormatter={(label) => `${label} год`}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#FF0000"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
