import {
  userReducer,
  getInitialState, // Новая функция для получения initialState
  loginUserThunk,
  authThunk,
} from "./userSlice";
import { setCookie } from "../utils/cookie";

// Мокаем API функции и утилиты
jest.mock("../utils/delivery-api", () => ({
  loginUserApi: jest.fn(),
  getTokenVerify: jest.fn(),
}));

jest.mock("../utils/cookie", () => ({
  setCookie: jest.fn(),
}));

// Создаем полноценный мок для localStorage
class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

const localStorageMock = new LocalStorageMock();

// Решение для Node.js среды
beforeAll(() => {
  Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock,
    writable: true,
  });
});

afterAll(() => {
  // Очищаем после всех тестов
  delete (globalThis as any).localStorage;
});

describe("userSlice reducer", () => {
  beforeEach(() => {
    // Очищаем localStorage перед каждым тестом
    localStorageMock.clear();
    // Сбрасываем все моки
    jest.clearAllMocks();
  });

  // Вспомогательная функция для получения актуального начального состояния
  const getCurrentInitialState = () => {
    return {
      ...getInitialState(),
      accessToken: localStorageMock.getItem("accessToken"),
    };
  };

  // Тест 1: Начальное состояние
  it("должен возвращать корректное начальное состояние", () => {
    const state = userReducer(undefined, { type: "unknown" });
    // Используем актуальное начальное состояние
    expect(state).toEqual(getCurrentInitialState());
  });

  // Тест 2: Обработка состояния pending для логина
  it("должен устанавливать isLoading в true при начале логина", () => {
    const action = loginUserThunk.pending("request-id", {
      username: "test",
      password: "password",
    });

    const state = userReducer(getCurrentInitialState(), action);
    expect(state.isLoading).toBe(true);
    expect(state.isAuthenticated).toBe(false);
  });

  // Тест 3: Успешный логин
  it("должен корректно обрабатывать успешный логин", () => {
    const payload = {
      access: "access-token-123",
      refresh: "refresh-token-456",
    };

    const action = loginUserThunk.fulfilled(payload, "request-id", {
      username: "test",
      password: "password",
    });

    const state = userReducer(
      { ...getCurrentInitialState(), isLoading: true },
      action
    );

    // Проверяем обновление состояния
    expect(state.isLoading).toBe(false);
    expect(state.accessToken).toBe("access-token-123");
    expect(state.isAuthenticated).toBe(true);

    // Проверяем вызовы side effects
    expect(setCookie).toHaveBeenCalledWith("accessToken", "access-token-123");

    // Проверяем сохранение в localStorage
    expect(localStorageMock.getItem("refreshToken")).toBe("refresh-token-456");
  });

  // Тест 4: Ошибка логина - ИСПРАВЛЕННЫЙ
  it("должен корректно обрабатывать ошибку логина", () => {
    // Предварительно сохраняем токен в localStorage
    localStorageMock.setItem("accessToken", "existing-token");

    const action = loginUserThunk.rejected(
      new Error("Login failed"),
      "request-id",
      { username: "test", password: "password" }
    );

    const prevState = {
      ...getCurrentInitialState(),
      isLoading: true,
      accessToken: "existing-token",
      isAuthenticated: true,
    };

    const state = userReducer(prevState, action);

    // Проверяем обновление состояния
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.accessToken).toBeNull();
    expect(state.loginError).toBe("Ошибка авторизации");

    // Проверяем очистку хранилища
    expect(localStorageMock.getItem("accessToken")).toBeNull();
  });

  // Тест 5: Успешная проверка аутентификации
  it("должен устанавливать флаги при успешной проверке auth", () => {
    const action = authThunk.fulfilled(
      { success: true },
      "request-id",
      undefined
    );

    const state = userReducer(getCurrentInitialState(), action);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isAuthenticated).toBe(true);
  });

  // Тест 6: Ошибка проверки аутентификации
  it("должен устанавливать флаги при ошибке проверки auth", () => {
    const action = authThunk.rejected(
      new Error("Auth failed"),
      "request-id",
      undefined
    );

    const state = userReducer(getCurrentInitialState(), action);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isAuthenticated).toBe(false);
  });

  // Тест 7: Обработка неизвестного действия
  it("должен возвращать текущее состояние для неизвестного действия", () => {
    const currentState = {
      ...getCurrentInitialState(),
      isAuthenticated: true,
      accessToken: "test-token",
    };

    const state = userReducer(currentState, { type: "UNKNOWN_ACTION" });
    expect(state).toEqual(currentState);
  });
});
