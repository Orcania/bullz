import http from "./http.service";
export class SocialAccountService {
  constructor(backend_api) {
    this.api = backend_api + "/socials";
  }

  async registerDiscordUser(data) {
    const result = await http.post(this.api + '/register-discord', data);
    return result.data;
  }

  async verifyDiscordJoin(data) {
    const result = await http.post(this.api + '/verify-discord-join', data);
    return result.data;
  }

  async registerTelegramdUser(data) {
    const result = await http.post(this.api + '/register-telegram', data);
    return result.data;
  }

  async verifyTelegramJoin(data) {
    const result = await http.post(this.api + '/verify-telegram-join', data);
    return result.data;
  }

  async isBotConnected(data) {
    const result = await http.post(this.api + '/check-bot-connected', data);
    return result.data;
  }
}
