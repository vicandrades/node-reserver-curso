const jwt = require('jsonwebtoken');

// ========================
//verificar token
//=========================

let verificaToken = (req, res, next) => {
    //para leer los header o cabeceras se usa el la funcion get de un request
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no válido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    });
};


// ========================
//verifica Admin Role
//=========================

let verificaAdmin_Role = (req, res, next) => {
    let role = req.usuario.role;

    if (!(role === 'ADMIN_ROLE')) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'role no válido'
            }
        })
    }

    next();

};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}