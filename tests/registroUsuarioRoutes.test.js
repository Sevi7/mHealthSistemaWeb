/* eslint-disable no-empty */
/* eslint-disable no-undef */
process.env.MONGODB_URI = 'mongodb://localhost:27017/mHealthDatabaseTest';

const request = require('supertest');
const app = require('../server');

describe('app', () => {
  test('POST incorrecto con todos los campos vacíos devuelve los errores', async () => {
    const res = await request(app)
      .post('/registroUsuario')
      .send({});
    expect(JSON.parse(res.text)).toEqual({
      ok: false,
      err: {
        nombre: 'El campo Nombre no puede estar vacío',
        apellidos: 'El campo Apellidos no puede estar vacío',
        email: 'El campo Email no puede estar vacío',
        contraseña: 'El campo Contraseña no puede estar vacío',
        fechaNacimiento: 'El campo Fecha de Nacimiento no puede estar vacío',
        altura: 'El campo Altura no puede estar vacío',
        sexo: 'El campo Sexo no puede estar vacío',
        diabetes: 'El valor introducido en el campo Diabetes no tiene un formato válido (si/no)',
      },
    });
  });

  test('POST incorrecto con varios campos con formato incorrecto devuelve los errores específicos a solventar', async () => {
    const res = await request(app)
      .post('/registroUsuario')
      .send({
        nombre: 'test',
        apellidos: 'test',
        email: 'estonoesunemail',
        contraseña: '1234',
        fechaNacimiento: '45/03/1993',
        altura: '0.2',
        sexo: 'niño',
        diabetes: 'negativo',
      });
    expect(JSON.parse(res.text)).toEqual({
      ok: false,
      err: {
        altura: 'El valor introducido en el campo Altura no es válido',
        diabetes: 'El valor introducido en el campo Diabetes no tiene un formato válido (si/no)',
        email: 'El valor introducido en el campo Email no tiene un formato válido',
        fechaNacimiento: 'El valor introducido en el campo Fecha Nacimiento no tiene un formato válido (DD/MM/AAAA)',
        sexo: 'El valor introducido en el campo Sexo debe ser masculino o femenino',
      },
    });
  });

  test('POST correcto devuelve los valores', async () => {
    const res = await request(app)
      .post('/registroUsuario')
      .send({
        nombre: 'test',
        apellidos: 'test',
        email: `test${Math.random()}@test.test`,
        contraseña: '1234',
        fechaNacimiento: '03/03/1993',
        altura: '1.95',
        sexo: 'masculino',
        diabetes: 'no',
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
