import http from "./http.service";
export class TasksService {
  constructor(backend_api) {
    this.api = backend_api;
    this.taskTemplateApi = backend_api + "/task-templates";
    this.submitTaskApi = backend_api + "/submit-tasks";
  }

  // Task Template
  async getTaskTemplates(account_id) {
    const result = await http.get(this.taskTemplateApi + "/get-tasks");
    return result.data;
  }

  // Submit Task
  async addSubmitTask(submitTask) {
    const result = await http.post(this.submitTaskApi, submitTask);
    return result.data;
  }

  async getSubmitTask(userId, taskId) {
    const result = await http.get(
      `${this.submitTaskApi}/get-submits-by-user/${userId}/challenge/${taskId}`
    );
    return result.data;
  }

  async updateSubmitTask(submitTask) {
    const result = await http.put(this.submitTaskApi, submitTask);
    return result.data;
  }

  async verifySubmitTask(submitTaskId) {
    const result = await http.get(
      `${this.submitTaskApi}/verify-task/${submitTaskId}`
    );
    return result.data;
  }
  
  async updateSubmit(submitData) {
    const result = await http.put(this.submitTaskApi + '/update-submit', submitData);
    return result.data;
  }
}
