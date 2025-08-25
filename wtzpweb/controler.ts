export interface SessionData {
  isSession: boolean;
  step: number;
  flow?: "gym" | "task"; // qual fluxo está ativo
  data: Record<string, any>; // dados temporários
}

class SessionManager {
  private sessions: Record<string, SessionData> = {};

  getSession(chatId: string): SessionData {
    if (!this.sessions[chatId]) {
      this.sessions[chatId] = { isSession: false, step: 0, data: {} };
    }
    return this.sessions[chatId];
  }

  setSession(chatId: string, data: Partial<SessionData>) {
    this.sessions[chatId] = { ...this.getSession(chatId), ...data };
  }

  resetSession(chatId: string) {
    this.sessions[chatId] = { isSession: false, step: 0, data: {} };
  }
}

export const sessionManager = new SessionManager();
