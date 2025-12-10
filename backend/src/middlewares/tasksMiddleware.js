const jwt = require('jsonwebtoken');

const validateTitle = (request, response, next) => {
    const { body } = request

    if (body.title === undefined)
        return response.status(400).json({message: 'The field title is requeried'})
    if (body.title === '')
        return response.status(400).json({message: 'The field has no title on it'})
    
    next()
}

const validateStatus = (request, response, next) => {
    const { body } = request

    if (body.status === undefined)
        return response.status(400).json({message: 'The field status is required'})
    if (body.title === "" && body.status === "")
        return response.status(400).json({message: 'The field has no status on it'})

    next()
}

const validateDay = (request, response, next) => {
    const diaAtual = new Date().getDay()

    if (diaAtual == 6 || diaAtual == 0)
        return response.status(403).json({erro: "Access denied!"})

    next()
}

const authenticate = (request, response, next) => {
    const token = request.headers.authorization?.split(' ')[1]
    if (!token) return response.status(401).json({ erro: 'Token não fornecido' });

    try {
        jwt.verify(token, 'segredo');
        next();
    } catch (err) {
        response.status(403).json({ erro: 'Token inválido' });
    }
}

module.exports = {
    validateTitle,
    validateStatus,
    validateDay,
    authenticate
}