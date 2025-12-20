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
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await tasksController.getAll(request, response);

        expect(taskSchema.find).toHaveBeenCalledTimes(1);
        expect(taskSchema.find).toHaveBeenCalledWith()
        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith(mockTasks);
    })

    test("Should return a task by ID", async () => {
        const mockTask = {_id: '1', title: 'Task 1'}
        taskSchema.findById.mockResolvedValue(mockTask)
        
        const request = {params: {id: '1'}}
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await tasksController.getById(request, response);

        expect(taskSchema.findById).toHaveBeenCalledTimes(1);
        expect(taskSchema.findById).toHaveBeenCalledWith('1')
        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith(mockTask);
    })

    test("Should create a task and return the status 201", async () => {
        const mockBody = {title: "Test 1", status: "pendente", created_at: Date.now}

        const mockCreatedTask = {_id: "1", ...mockBody}
        taskSchema.create.mockResolvedValue(mockCreatedTask)

        const request = { body: mockBody }
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        
        await tasksController.createTask(request, response)

        expect(taskSchema.create).toHaveBeenCalledTimes(1);
        expect(taskSchema.create).toHaveBeenCalledWith(mockBody)
        expect(response.status).toHaveBeenCalledWith(201)
        expect(response.json).toHaveBeenCalledWith(mockCreatedTask);
    })

    test("Should delete a task by id", async () => {
        const mockDeletedTask = {_id: '1', title: 'Task to be deleted'}
        taskSchema.findByIdAndDelete.mockResolvedValue(mockDeletedTask)

        const request = { params: {id: '1'} }
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await tasksController.deleteTask(request, response)

        expect(taskSchema.findByIdAndDelete).toHaveBeenCalledTimes(1);
        expect(taskSchema.findByIdAndDelete).toHaveBeenCalledWith(request.params.id)
        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith(mockDeletedTask);
    })

    test('Should update a task and return it with status 201', async () => {
        // 🔹 Mock de entrada e saída
        const mockBody = { title: 'Updated task' };
        const mockUpdatedTask = { _id: '123', ...mockBody };

        taskSchema.findByIdAndUpdate.mockResolvedValue(mockUpdatedTask);

        // 🔹 Mock do request/response
        const request = { params: { id: '123' }, body: mockBody };
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // 🔹 Executa
        await tasksController.updateTask(request, response);

        // 🔹 Verificações
        expect(taskSchema.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(taskSchema.findByIdAndUpdate).toHaveBeenCalledWith('123', mockBody, { new: true });

        expect(response.status).toHaveBeenCalledWith(201);
        expect(response.json).toHaveBeenCalledWith(mockUpdatedTask);
    });

})