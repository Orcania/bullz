import axios from "axios";
import { printLog } from "utils/printLog";
import authHeader from "./auth-header";

export class ChatService {
  constructor(chat_backend_url) {
    this.api = chat_backend_url;
  }
  async getRooms() {
    const result = await axios.get(this.api+'/rooms', this.headers);
    printLog([result.data], 'success');
    return result.data;
  }
  async createRoom(room) {
    const result = await axios.post(this.api+'/rooms', room, { headers: authHeader() });
    printLog([result.data], 'success');
    return result.data;
  }
  async getMessages(address) {
    const result = await axios.get(this.api + "/messages");
    return result.data;
  }

  async getMessagesbyRoom(id) {
    const result = await axios.get(this.api + '/messages/room/'+id, { headers: authHeader() });
    return result.data;
  }
  async getRoomsbyUser(id) {
    const result = await axios.get(this.api + '/rooms/getbyuser/'+id, { headers: authHeader() });
    return result.data;
  }
  async getFileTypes() {
    const result = await axios.get(this.api + '/filetypes', { headers: authHeader() });
    return result.data;
  }
  async updateSeenOneByOne(payload) {
    const result = await axios.put(this.api+'/messages', payload, { headers: authHeader() });
    printLog(["updateSeenOneByOne",result.data], 'success');
    return result.data;
  }
  async updateSeenByRoom(payload) {
    
    const result = await axios.put(this.api+'/messages/update-seen-by-room-and-receiver', payload, { headers: authHeader() });
    printLog(["updateSeenByRoom",result.data], 'success');
    return result.data;
  }

  async getChatRoomDetailsForUser(sender_id, receiver_id) {
    const result = await axios.get(this.api + `/rooms/getdirectroom/sender/${sender_id}/receiver/${receiver_id}`, { headers: authHeader() });
    return result.data;
  }

  async deleteUserChatRequest(room_id) {
    const result = await axios.delete(this.api+`/rooms?id=${room_id}`, { headers: authHeader() });
    printLog([result.data], 'success');
    return result;
  }
}
export default new ChatService();