const chai = require('chai')
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const  Database  = require('../src/database');
const { makeServer } = require('../src/server/server');

chai.use(chaiHttp);
chai.should();

describe('POST /usuarios', () =>{
  const usuarioRepetido = {
    "userName": "Ignacio",
    "name": "Ignacio",
    "email": "ignaspahr@gmail.com",
    "phoneNumber": "111111111",
    "password": "ignacio"
  };

  const usuarioFalso = {
    "userName": "javier",
    "name": "javier",
    "email": "javier@gmail.com",
    "phoneNumber": "111111111",
    "password": "ignacio"
  }

  const creadoFalso = {
    "userName": "javier",
    "name": "javier",
    "email": "javier@gmail.com",
    "phoneNumber": "111111111",
    "password": "65416351",
    "admin": false
  }

  before(() => {
    const ModeloFalso = {
      findOne(nuevoUsuario) {
        if (nuevoUsuario.where.email !== undefined && nuevoUsuario.where.email !== usuarioRepetido.email) {
          return new Promise(function(resolve){
            setTimeout(function() {
              resolve(null)
            }, 0);
          })
        }else if (nuevoUsuario.where.email !== undefined && nuevoUsuario.where.email === usuarioRepetido.email) {
          return new Promise(function(resolve){
            setTimeout(function() {
              resolve(2)
            }, 0);
          })
        } else if (nuevoUsuario.where.userName !== undefined && nuevoUsuario.where.userName !== usuarioRepetido.userName) {
          return new Promise(function(resolve){
            setTimeout(function() {
              resolve(null)
            }, 0);
          })
        } else if (nuevoUsuario.where.userName !== undefined && nuevoUsuario.where.userName === usuarioRepetido.userName) {
          return new Promise(function(resolve){
            setTimeout(function() {
              resolve(2)
            }, 0);
          })
        }
      },
      create() {
        return Promise.resolve(creadoFalso);
      }
    };
    sinon.stub( Database, 'getModel').returns(ModeloFalso);
  });

  it('Devuelve un objeto con los datos del usuario creado y un status 200', (done)=>{
    const server = makeServer();
    chai.request(server)
      .post('/api/v1/usuarios')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(usuarioFalso)
      .end( (err, res) =>{
          expect(res).to.have.status(200);
          expect(res.body).to.have.all.keys(['name', 'userName', 'phoneNumber', 'email', 'password', 'admin']);
        done()
      })
  })

  it('Le pasamos repetido el mail y el usuario y devuelve un status 406', (done)=>{
    const server = makeServer();
    chai.request(server)
      .post('/api/v1/usuarios')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(usuarioRepetido)
      .end( (err, res) =>{
          expect(res).to.have.status(406);
          expect(res.body).to.have.all.keys(['status_code', 'message']);
          expect(err).to.be.null
        done()
      })
  })
})
