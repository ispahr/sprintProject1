const { getModel } = require("../../database");
const { logueado } = require("../../database/objetos");

async function crear_cuenta(req,res) {
    const newUser = req.body;
    try {
        const Usuarios = getModel('Usuarios');
        await Usuarios.create(newUser)
        usuarios.push(newUser);
        res.status(200).send(usuarios)

    } catch (error) {

        res.status(400).send({'status_code':400,'message':'Error in the database', 'error':error})
      }
    }

    async function iniciar_sesion(req,res) {
      const email = req.headers.email;
      const password = req.headers.password;
      let valido = false;

      try {
        const Usuarios = getModel('Usuarios');
        if (email.includes('@') && email.includes('.') && !!password === true) {
          const find = await Usuarios.findOne( { where: { email: email, password:password} })
          //console.log(find.dataValues)

          if (find !== null) {
            logueado.usuario = find.dataValues;
            logueado.sign_in = true;
            valido = true;

            res.status(200).send("Sesion iniciada")
          }

        } else{
          valido = true;
          res.status(406).send("Formato de parametros en headers no valido");
        }

      } catch (error) {
        res.status(400).send({'status_code':400,'message':'Error in the database', 'error':error})

      }
    if (valido === false) {
        res.status(406).send("Usuario no registrado")
    }

}

module.exports = {
    crear_cuenta,
    iniciar_sesion
}
