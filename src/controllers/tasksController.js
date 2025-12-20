const taskSchema = require('../models/taskSchema')
const userSchema = require('../models/userSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PDFDocument = require("pdfkit")

const getAll = async (request, response) => {
    try {
        const tasks = await taskSchema.find()
        return response.status(200).json(tasks)
    } catch (error) {
        console.log(error)
    }
}

const getById = async (request, response) => {
    try {
        const { id } = request.params
        const task = await taskSchema.findById(id)
        return response.status(200).json(task)
    } catch (error) {
        console.log(error)
    }
}

const createTask = async (request, response) => {
    try {
        const createdTask = await taskSchema.create(request.body)
        return response.status(201).json(createdTask)
    } catch (error) {
        console.log(error)
    }
}

const deleteTask = async (request, response) => {
    try {
        const { id } = request.params
        const deletedTask = await taskSchema.findByIdAndDelete(id)
        return response.status(204).json(deletedTask)
    } catch (error) {
        console.log(error)
    }
}

const updateTask = async (request, response) => {
    try {
        const { id } = request.params
    
        const updatedTask = await taskSchema.findByIdAndUpdate(id, request.body, { new: true })
        return response.status(201).json(updatedTask)
    } catch (error) {
        console.log(error)
    }
}

const searchLogin = async (request, response) => {
    
    try{
        const { email, senha } = request.body;

        const usuario = await userSchema.findOne({email});

        if (!usuario) return response.status(401).json({erro: "User not found!"})
        
        const senhaCorreta = await bcrypt.compare(senha, usuario.password)
        if(!senhaCorreta) return response.status(401).json({erro: "Incorrect password!"})
        
        const token = jwt.sign({ email: usuario.email }, 'segredo', { expiresIn: '1h' });
        return response.status(200).json({ token });

    } catch (err){
        console.error(`Esse foi o erro ${err}`);
        response.status(500).json({ erro: "Erro interno do servidor!" });
    }
    
}

const gerarPdf = async (request, response) => {
    try {
        const doc = new PDFDocument();
    
        // Define cabeçalhos HTTP para o navegador baixar o arquivo
        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Content-Disposition', 'attachment; filename=lista_livros.pdf');
    
        // “Encanamos” o PDF direto na resposta
        doc.pipe(response);
    
        doc.fontSize(18).text("Lista de Tarefas", { align: 'center' });
        doc.moveDown();
    
        const tasks = await taskSchema.find()
    
        tasks.forEach(task => {
            doc.fontSize(12).text(`ID: ${task.id} | ${task.title} - ${task.status} - ${task.created_at.toLocaleDateString()}`);
        });
    
        doc.end();
    } catch (error) {
        console.log(error)
    }
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
