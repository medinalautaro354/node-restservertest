const jwt = require('jsonwebtoken');
//Verifir token

let validateToken = (req, res, next) => {

    let accessToken = req.get('AccessToken');

    jwt.verify(accessToken, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token invalido.'
                }
            });
        }
        //Creamos una nueva variable en la req y se guarda el usuario.
        req.user = decode.user;
        next();
    });
};

let validateAdminRole = (req, res, next) => {
    //obtengo el user del req ya que al validar el token guardo el usuario en el req como user.
    let user = req.user;

    if (user.role != 'ADMIN_ROLE') {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No tiene permisos.'
            }
        })
    }

    next();

}

module.exports = {
    validateToken,
    validateAdminRole
}