const tasksModel = require('../models/tasksModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PDFDocument = require("pdfkit")

const getAll = async (request, response) => {
    const [tasks] = await tasksModel.getAll()
    return response.status(200).json(tasks)
}

const getById = async (request, response) => {
    const { id } = request.params

    const [task] = await tasksModel.getById(id)

    return response.status(200).json(task)
}

const createTask = async (request, response) => {
    const createdTask = await tasksModel.createTask(request.body)

    return response.status(201).json(createdTask)
}

const deleteTask = async (request, response) => {
    const { id } = request.params
    await tasksModel.deleteTask(id)
    return response.status(204).json()
}

const updateTask = async (request, response) => {
    const { id } = request.params

    const updatedTask = await tasksModel.updateTask(id, request.body)
    return response.status(201).json(updatedTask)
}

const searchLogin = async (request, response) => {
    
    try{
        const { email, senha } = request.body;

        const usuario = await tasksModel.searchUser(email);

        if (!usuario) return response.status(401).json({erro: "User not found!"})
        
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
        if(!senhaCorreta) return response.status(401).json({erro: "Incorrect password!"})
        
        const token = jwt.sign({ email: usuario.email }, 'segredo', { expiresIn: '1h' });
        return response.status(200).json({ token });

    } catch (err){
        console.error(err);
        response.status(500).json({ erro: 'Erro interno no servidor' });
    }
    
}

const gerarPdf = async (request, response) => {
    const doc = new PDFDocument();

    // Define cabeçalhos HTTP para o navegador baixar o arquivo
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'attachment; filename=lista_livros.pdf');

    // “Encanamos” o PDF direto na resposta
    doc.pipe(response);

    doc.fontSize(18).text("To Do List", { align: 'center' });
    doc.moveDown();

    const [tasks] = await tasksModel.getAll()

    tasks.forEach(task => {
        doc.fontSize(12).text(`ID: ${task.id} | ${task.title} - ${task.status} - ${task.created_at}`);
    });

    doc.end();
}

module.exports = {
    getAll,
    getById,
    createTask,
    deleteTask,
    updateTask,
    searchLogin, 
    gerarPdf
};