import { snakeToCamel, convertKeysToCamelCase } from "./snake-to-camel";

describe("snakeToCamel", () => {
  // Тест 1: Простая конвертация одного символа
  it("должен конвертировать snake_case в camelCase для простых строк", () => {
    expect(snakeToCamel("hello_world")).toBe("helloWorld");
  });

  // Тест 2: Несколько подчеркиваний
  it("должен обрабатывать строки с несколькими подчеркиваниями", () => {
    expect(snakeToCamel("my_test_string")).toBe("myTestString");
  });

  // Тест 3: Одно подчеркивание
  it("должен обрабатывать строки с одним подчеркиванием", () => {
    expect(snakeToCamel("_test")).toBe("Test");
  });

  // Тест 4: Пустая строка
  it("должен возвращать пустую строку при вводе пустой строки", () => {
    expect(snakeToCamel("")).toBe("");
  });

  // Тест 5: Строка без подчеркиваний
  it("должен возвращать оригинальную строку без изменений, если нет подчеркиваний", () => {
    expect(snakeToCamel("alreadyCamelCase")).toBe("alreadyCamelCase");
  });
});

describe("convertKeysToCamelCase", () => {
  // Тест 1: Простой плоский объект
  it("должен конвертировать ключи простого объекта", () => {
    const input = {
      first_name: "John",
      last_name: "Doe",
      age_group: "adult",
    };

    const expected = {
      firstName: "John",
      lastName: "Doe",
      ageGroup: "adult",
    };

    expect(convertKeysToCamelCase(input)).toEqual(expected);
  });

  // Тест 2: Вложенные объекты
  it("должен рекурсивно конвертировать вложенные объекты", () => {
    const input = {
      user_data: {
        account_info: {
          created_at: "2023-01-01",
        },
        contact_list: [{ phone_number: "123456" }],
      },
    };

    const expected = {
      userData: {
        accountInfo: {
          createdAt: "2023-01-01",
        },
        contactList: [{ phoneNumber: "123456" }],
      },
    };

    expect(convertKeysToCamelCase(input)).toEqual(expected);
  });

  // Тест 3: Массивы объектов
  it("должен обрабатывать массивы объектов", () => {
    const input = [
      { item_id: 1, item_name: "Book" },
      { item_id: 2, item_name: "Pen" },
    ];

    const expected = [
      { itemId: 1, itemName: "Book" },
      { itemId: 2, itemName: "Pen" },
    ];

    expect(convertKeysToCamelCase(input)).toEqual(expected);
  });

  // Тест 4: Примитивные значения
  it("должен возвращать примитивы без изменений", () => {
    expect(convertKeysToCamelCase("test_string")).toBe("test_string");
    expect(convertKeysToCamelCase(42)).toBe(42);
    expect(convertKeysToCamelCase(null)).toBeNull();
    expect(convertKeysToCamelCase(undefined)).toBeUndefined();
  });

  // Тест 5: Смешанные данные
  it("должен обрабатывать сложные структуры с разными типами данных", () => {
    const input = {
      data_list: [
        { user_info: { first_name: "Alice" } },
        { user_info: { first_name: "Bob" } },
        "plain_string",
        100,
        null,
      ],
      meta_data: {
        pagination_info: {
          total_items: 100,
          items_per_page: 10,
        },
      },
    };

    const expected = {
      dataList: [
        { userInfo: { firstName: "Alice" } },
        { userInfo: { firstName: "Bob" } },
        "plain_string",
        100,
        null,
      ],
      metaData: {
        paginationInfo: {
          totalItems: 100,
          itemsPerPage: 10,
        },
      },
    };

    expect(convertKeysToCamelCase(input)).toEqual(expected);
  });

  // Тест 6: Уже camelCase ключи
  it("не должен изменять уже camelCase ключи", () => {
    const input = {
      alreadyCamel: "value",
      anotherOne: "test",
    };

    expect(convertKeysToCamelCase(input)).toEqual(input);
  });
});
