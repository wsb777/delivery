import { findEdgeDates } from './edge-dates'; // Импортируем функцию
import type { TDelivery } from './types'; // Импортируем тип

describe('findEdgeDates', () => {
  // Тест 1: Основной тест с разными датами
  it('находит мин и макс даты в массиве доставок', () => {
    const deliveries: TDelivery[] = [
      createDelivery('15-01-2023'),
      createDelivery('10-01-2023'),
      createDelivery('20-01-2023'),
    ];

    const result = findEdgeDates(deliveries);
    expect(result).toEqual({
      minDate: '10-01-2023',
      maxDate: '20-01-2023',
    });
  });

  // Тест 2: Даты в обратном порядке
  it('корректно обрабатывает даты в убывающем порядке', () => {
    const deliveries: TDelivery[] = [
      createDelivery('20-03-2023'),
      createDelivery('15-03-2023'),
      createDelivery('10-03-2023'),
    ];

    const result = findEdgeDates(deliveries);
    expect(result).toEqual({
      minDate: '10-03-2023',
      maxDate: '20-03-2023',
    });
  });

  // Тест 3: Сравнение разных месяцев и годов
  it('корректно сравнивает даты из разных месяцев и годов', () => {
    const deliveries: TDelivery[] = [
      createDelivery('01-01-2024'),
      createDelivery('31-12-2023'),
      createDelivery('15-06-2023'),
    ];

    const result = findEdgeDates(deliveries);
    expect(result).toEqual({
      minDate: '15-06-2023',
      maxDate: '01-01-2024',
    });
  });

  // Тест 4: Одинаковые даты
  it('возвращает одинаковые даты когда все элементы равны', () => {
    const deliveries: TDelivery[] = [
      createDelivery('01-01-2023'),
      createDelivery('01-01-2023'),
      createDelivery('01-01-2023'),
    ];

    const result = findEdgeDates(deliveries);
    expect(result).toEqual({
      minDate: '01-01-2023',
      maxDate: '01-01-2023',
    });
  });

  // Тест 5: Один элемент в массиве
  it('корректно обрабатывает массив с одним элементом', () => {
    const deliveries: TDelivery[] = [createDelivery('05-05-2023')];
    
    const result = findEdgeDates(deliveries);
    expect(result).toEqual({
      minDate: '05-05-2023',
      maxDate: '05-05-2023',
    });
  });

  // Тест 6: Минимальная дата в конце массива
  it('находит мин дату когда она в конце массива', () => {
    const deliveries: TDelivery[] = [
      createDelivery('20-01-2023'),
      createDelivery('15-01-2023'),
      createDelivery('10-01-2023'),
    ];

    const result = findEdgeDates(deliveries);
    expect(result.minDate).toBe('10-01-2023');
  });

  // Тест 7: Максимальная дата в начале массива
  it('находит макс дату когда она в начале массива', () => {
    const deliveries: TDelivery[] = [
      createDelivery('31-12-2023'),
      createDelivery('15-01-2023'),
      createDelivery('10-01-2023'),
    ];

    const result = findEdgeDates(deliveries);
    expect(result.maxDate).toBe('31-12-2023');
  });

  // Вспомогательная функция для создания объектов доставки
  function createDelivery(orderDate: string): TDelivery {
    return {
      id: 1,
      orderDate,
      transport: 'A111AA',
      service: 'До двери',
      status: 'Доставлен',
      distance: 100,
      packagingType: 'Коробка',
    };
  }
});