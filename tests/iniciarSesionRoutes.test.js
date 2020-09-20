/* eslint-disable no-empty */
/* eslint-disable no-undef */
process.env.MONGODB_URI = 'mongodb://localhost:27017/mHealthDatabaseTest';

const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../server');

const Usuario = mongoose.model('Usuario');

describe('app', () => {
  beforeAll(async (done) => {
    const usuario = new Usuario({
      nombre: 'test',
      apellidos: 'test',
      email: 'testInicioSesion@test.test',
      contraseña: '$2b$10$/LgVXpuPWS4u1ltpeGqyB.37Dg7iFdQFwYcQ0UauQHN9/GyjPrBq2', // contraseña 1234 encriptada
      fechaNacimiento: '1993-03-03T00:00:00.000Z',
      altura: '1.95',
      sexo: 'masculino',
      diabetes: 'no',
    });
    try {
      await usuario.save();
    } catch (error) { }
    done();
  });

  test('contraseña incorrecta devuelve mensaje de error', async () => {
    const res = await request(app)
      .post('/iniciarSesion')
      .send({
        email: 'testInicioSesion@test.test',
        contraseña: '1111',
      });
    expect(JSON.parse(res.text)).toEqual({
      ok: false,
      err: {
        message: 'Usuario o contraseña incorrectos',
      },
    });
  });

  test('usuario no registrado devuelve mensaje de error', async () => {
    const res = await request(app)
      .post('/iniciarSesion')
      .send({
        email: 'noregistrado@test.test',
        contraseña: '1234',
      });
    expect(JSON.parse(res.text)).toEqual({
      ok: false,
      err: {
        message: 'Usuario no dado de alta en el sitema',
      },
    });
  });

  test('email y contraseña correctos devuelve respuesta satisfactoria', async () => {
    const res = await request(app)
      .post('/iniciarSesion')
      .send({
        email: 'testInicioSesion@test.test',
        contraseña: '1234',
      });
    expect(JSON.parse(res.text)).toEqual(expect.objectContaining({
      ok: true,
      expiraEn: 7200,
      usuarioDatos: {
        fechaNacimiento: '1993-03-03T00:00:00.000Z',
        altura: 1.95,
        sexo: 'masculino',
        diabetes: false,
      },
    }));
  });
});
