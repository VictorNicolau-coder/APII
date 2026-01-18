const taskSchema = require('../models/taskSchema')
const userSchema = require('../models/userSchema')
const s3 = require('../config/s3Client');

const {PutObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit')

require('dotenv').config();

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
        let imageUrl = null

        // Se tiver imagem no request (via multer)
        if (request.file) {
            const file = request.file
            const fileName = `${Date.now()}-${file.originalname}`

            const uploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype
            }

            await s3.send(new PutObjectCommand(uploadParams))

            imageUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`
        }

        // Cria a task com o link da imagem (se houver)
        const createdTask = await taskSchema.create({
        ...request.body,
        imageUrl
        })

        return response.status(201).json(createdTask)
    } catch (error) {
        console.log(error)
        return response.status(500).json({ message: 'Erro ao criar task', error })
    }
}

const deleteTask = async (request, response) => {
    try {
        const { id } = request.params
        const deletedTask = await taskSchema.findByIdAndDelete(id)
        return response.status(200).json(deletedTask)
    } catch (error) {
        console.log(error)
    }
}

const updateTask = async (request, response) => {
    try {
        const { id } = request.params
        const task = await taskSchema.findById(id)

        if (!task) {
            return response.status(404).json({ message: 'Task não encontrada' })
        }

        let imageUrl = task.imageUrl // mantém a imagem atual por padrão

        // Se o usuário enviou uma nova imagem
        if (request.file) {
        const file = request.file
        const fileName = `${Date.now()}-${file.originalname}`

        //Se já existe uma imagem anterior, deletamos do S3
        if (task.imageUrl) {
            const oldKey = task.imageUrl.split('/').pop() // pega só o nome do arquivo
            await s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: oldKey,
            })
            )
        }

        // Faz upload da nova imagem
        const uploadParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        }

        await s3.send(new PutObjectCommand(uploadParams))

        imageUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`
        }

        // Atualiza os campos da task
        const updatedTask = await taskSchema.findByIdAndUpdate(
        id,
        {
            ...request.body,
            imageUrl,
        },
        { new: true }
        )

        return response.status(200).json(updatedTask)
    } catch (error) {
        console.error(error)
        return response.status(500).json({ message: 'Erro ao atualizar task', error })
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
    
        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Content-Disposition', 'attachment; filename=lista_livros.pdf');
    
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
