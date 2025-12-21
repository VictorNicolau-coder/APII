const tasksController = require('../tasksController.js')
const taskSchema = require('../../models/taskSchema')
const PDFDocument = require("pdfkit")

jest.mock('pdfkit')
jest.mock('../../models/taskSchema')

describe("Tasks controller", ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
    });

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
        const mockBody = { title: 'Updated task' };
        const mockUpdatedTask = { _id: '123', ...mockBody };

        taskSchema.findByIdAndUpdate.mockResolvedValue(mockUpdatedTask);

        const request = { params: { id: '123' }, body: mockBody };
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await tasksController.updateTask(request, response);

        expect(taskSchema.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(taskSchema.findByIdAndUpdate).toHaveBeenCalledWith('123', mockBody, { new: true });

        expect(response.status).toHaveBeenCalledWith(201);
        expect(response.json).toHaveBeenCalledWith(mockUpdatedTask);
    });

    test("Should return a PDF", async () => {
        const mockTasks = [
            {id:'1', title: 'Test A', status: 'concluído', created_at: new Date('2025-01-02')},
            {id:'2', title: 'Test B', status: 'pedente', created_at: new Date('2025-01-02')}
        ]
        taskSchema.find.mockResolvedValue(mockTasks)

        const mockPipe = jest.fn();
        const mockFontSize = jest.fn().mockReturnThis();
        const mockText = jest.fn().mockReturnThis();
        const mockMoveDown = jest.fn().mockReturnThis();
        const mockEnd = jest.fn();

        PDFDocument.mockImplementation(() => ({
            pipe: mockPipe,
            fontSize: mockFontSize,
            text: mockText,
            moveDown: mockMoveDown,
            end: mockEnd
        }));

        const request = {}
        const response = {
            setHeader: jest.fn()
        }

        await tasksController.gerarPdf(request, response)
        
        expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
        expect(response.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=lista_livros.pdf');

        expect(mockPipe).toHaveBeenCalledWith(response);
        expect(mockFontSize).toHaveBeenCalledWith(18);
        expect(mockText).toHaveBeenCalledWith('Lista de Tarefas', { align: 'center' });
        expect(mockMoveDown).toHaveBeenCalled();

        expect(taskSchema.find).toHaveBeenCalledTimes(1);

        expect(mockText).toHaveBeenCalledWith(
            expect.stringMatching(/ID: 1/)
        );
        expect(mockText).toHaveBeenCalledWith(
            expect.stringMatching(/ID: 2/)
        );

        expect(mockEnd).toHaveBeenCalled();

    })

})