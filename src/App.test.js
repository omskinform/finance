import { render, screen } from '@testing-library/react';
import App from './App';

test('renders financial calculator components', () => {
  render(<App />);
  
  // Проверяем наличие основного заголовка
  const headerElement = screen.getByText(/Финансовый калькулятор/i);
  expect(headerElement).toBeInTheDocument();
  
  // Проверяем наличие полей ввода
  const monthlyInput = screen.getByLabelText(/Ежемесячные накопления/i);
  expect(monthlyInput).toBeInTheDocument();
  
  const interestInput = screen.getByLabelText(/Доходность вложений/i);
  expect(interestInput).toBeInTheDocument();
  
  const goalInput = screen.getByLabelText(/Стоимость цели/i);
  expect(goalInput).toBeInTheDocument();
  
  // Проверяем наличие контейнера для графика
  const chartContainer = screen.getByTestId('chart-container');
  expect(chartContainer).toBeInTheDocument();
  
  // Проверяем наличие блока результата
  const resultBlock = screen.getByText(/Вы достигнете цели за/i);
  expect(resultBlock).toBeInTheDocument();
});