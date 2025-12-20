const tasksController = require('../tasksController.js')
const taskSchema = require('../../models/taskSchema')

jest.mock('../../models/taskSchema')

describe("Tasks controller", ()=>{
    test("Should fetch all tasks from BD", async () => {
        const mockTasks = [
            {title: "Task 1"},
            {title: "Task 2"}
        ]

        taskSchema.find.mockResolvedValue(mockTasks)
        
        const request = {};
        response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await tasksController.getAll(request, response);

        expect(taskSchema.find).toHaveBeenCalledTimes(1);
        expect(taskSchema.find).toHaveBeenCalledWith()
        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith(mockTasks);
    })


})