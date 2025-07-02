import React, { useState, useEffect, useCallback } from 'react';
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

// Функция для правильного склонения лет
function getYearString(years) {
  years = parseInt(years);
  if (isNaN(years)) return 'лет';
  
  const lastDigit = years % 10;
  const lastTwoDigits = years % 100;
  
  if (lastDigit === 1 && lastTwoDigits !== 11) return 'год';
  if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) 
    return 'года';
  return 'лет';
}

function App() {
  const [monthly, setMonthly] = useState('20000');
  const [goal, setGoal] = useState('1000000');
  const [interestRate, setInterestRate] = useState('10');
  const [years, setYears] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Обработчик изменения размера окна
  const handleResize = useCallback(() => {
    setScreenWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    calculateYears();
  }, [monthly, goal, interestRate]);

  const calculateYears = () => {
    const monthlyNum = monthly === '' ? 0 : Number(monthly);
    const goalNum = goal === '' ? 0 : Number(goal);
    const interestRateNum = interestRate === '' ? 0 : Number(interestRate);

    let total = 0;
    let year = 0;
    let rate = interestRateNum / 100;
    let data = [];

    while (total < goalNum && year < 100) {
      total = (total + monthlyNum * 12) * (1 + rate);
      data.push({ 
        year: year + 1, 
        amount: Math.round(total),
        yearLabel: `${year + 1}`
      });
      year++;
    }
    setYears(year);
    setChartData(data);
  };

  // Форматирование подписей для оси X
  const formatXAxisTick = (tick) => {
    if (screenWidth < 480) return tick; // На мобильных только цифры
    return `${tick} г.`;
  };

  // Определение интервала для подписей оси X
  const getXAxisInterval = () => {
    if (screenWidth < 480) return 5;
    if (screenWidth < 768) return 3;
    return 0;
  };

  return (
    <div className="container">
      <h1>Финансовый калькулятор</h1>
      <div className="input-group">
        <label>Ежемесячные накопления (₽):</label>
        <input
          type="number"
          value={monthly}
          onChange={(e) => setMonthly(e.target.value)}
          onFocus={(e) => e.target.select()}
        />
      </div>
      <div className="input-group">
        <label>Доходность вложений (% годовых):</label>
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          onFocus={(e) => e.target.select()}
        />
      </div>
      <div className="input-group">
        <label>Стоимость цели (₽):</label>
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          onFocus={(e) => e.target.select()}
        />
      </div>
      <div className="result">
        <p>Вы достигнете цели за {years} {getYearString(years)}</p>
      </div>

      <div className="chart-container" data-testid="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
            <XAxis
              dataKey="year"
              tickFormatter={formatXAxisTick}
              interval={getXAxisInterval()}
              minTickGap={10}
              angle={screenWidth < 480 ? -45 : 0}
              tickMargin={10}
              height={screenWidth < 480 ? 50 : 40}
            />
            <YAxis
              tickFormatter={(tick) => formatNumber(tick)}
              width={screenWidth < 480 ? 60 : 80}
              domain={['auto', 'auto']}
              allowDataOverflow={true}
            />
            <Tooltip
              formatter={(value) => [formatNumber(value) + ' ₽', 'Сумма']}
              labelFormatter={(label) => `${label} ${getYearString(label)}`}
              contentStyle={{
                backgroundColor: 'var(--color-accent-bg)',
                borderColor: 'var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-text)'
              }}
              itemStyle={{ color: 'var(--color-result)' }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="var(--color-chart-line)"
              strokeWidth={2}
              dot={{ r: screenWidth < 480 ? 2 : 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;