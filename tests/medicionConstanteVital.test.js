/* eslint-disable no-undef */
process.env.MONGODB_URI = 'mongodb://localhost:27017/mHealthDatabaseTest';

const request = require('supertest');
const mongoose = require('mongoose');

const mockMiddleware = require('../routes/middleware');

jest.mock('../routes/middleware');

const app = require('../server');

const Usuario = mongoose.model('Usuario');

describe('app', () => {
  let mockUsuarioId;
  beforeAll(async (done) => {
    const usuario = new Usuario({
      nombre: 'test',
      apellidos: 'test',
      email: 'test@test.test',
      contraseña: '1234',
      fechaNacimiento: '03/03/1993',
      altura: '1.95',
      sexo: 'masculino',
      diabetes: 'no',
    });
    try {
      const usuarioDB = await usuario.save();
      mockUsuarioId = usuarioDB.id;
    } catch (error) {
      const usuarioDB = await Usuario.findOne({ email: 'test@test.test' });
      mockUsuarioId = usuarioDB.id;
    }
    done();
  });

  describe('medicionConstanteVital routes', () => {
    mockMiddleware.comprobarToken.mockImplementation((req, res, next) => {
      req.usuarioId = mockUsuarioId;
      next();
    });

    describe('frecuenciaCardiaca', () => {
      test('POST correcto devuelve los valores', async () => {
        const valores = [{ valor: 200, fecha: 1600631914000, enReposo: false }];
        const res = await request(app)
          .post('/medicionConstanteVital/frecuenciaCardiaca')
          .send({
            valores,
          });
        expect(JSON.parse(res.text).mediciones).toEqual(valores);
      });

      test('POST incorrecto devuelve mensaje de error', async () => {
        const valores = [{ valor: '200', fecha: 1600631914000, enReposo: false }];
        const res = await request(app)
          .post('/medicionConstanteVital/frecuenciaCardiaca')
          .send({
            valores,
          });
        expect(JSON.parse(res.text)).toEqual({
          ok: false,
          err: {
            message: 'El formato introducido de las mediciones no es correcto. Todas las mediciones deben tener \'valor\' (Number), \'fecha\' en milisegundos (Number), \'enReposo\' (Boolean)',
          },
        });
      });
    });

    describe('temperatura', () => {
      test('POST correcto devuelve los valores', async () => {
        const valores = [{ valor: 36, fecha: 1600631914000 }];
        const res = await request(app)
          .post('/medicionConstanteVital/temperatura')
          .send({
            valores,
          });
        expect(JSON.parse(res.text).mediciones).toEqual(valores);
      });

      test('POST incorrecto devuelve mensaje de error', async () => {
        const valores = [{ valor: 36 }];
        const res = await request(app)
          .post('/medicionConstanteVital/temperatura')
          .send({
            valores,
          });
        expect(JSON.parse(res.text)).toEqual({
          ok: false,
          err: {
            message: 'El formato introducido de las mediciones no es correcto. Todas las mediciones deben tener \'valor\' (Number), \'fecha\' en milisegundos (Number)',
          },
        });
      });
    });
  });

  describe('presionArterial', () => {
    test('POST correcto devuelve los valores', async () => {
      const valores = [{ valor: 120, diastolica: 60, fecha: 1600631914000 }];
      const res = await request(app)
        .post('/medicionConstanteVital/presionArterial')
        .send({
          valores,
        });
      expect(JSON.parse(res.text).mediciones).toEqual(valores);
    });

    test('POST incorrecto devuelve mensaje de error', async () => {
      const valores = [{ valor: 120, fecha: 1600631914000 }];
      const res = await request(app)
        .post('/medicionConstanteVital/presionArterial')
        .send({
          valores,
        });
      expect(JSON.parse(res.text)).toEqual({
        ok: false,
        err: {
          message: 'El formato introducido de las mediciones no es correcto. Todas las mediciones deben tener \'valor\' (Number), \'fecha\' en milisegundos (Number), \'diastolica\' (Number)',
        },
      });
    });
  });

  describe('glucemia', () => {
    test('POST correcto devuelve los valores', async () => {
      const valores = [{ valor: 110, fecha: 1600631914000, postprandial: false }];
      const res = await request(app)
        .post('/medicionConstanteVital/glucemia')
        .send({
          valores,
        });
      expect(JSON.parse(res.text).mediciones).toEqual(valores);
    });

    test('POST incorrecto devuelve mensaje de error', async () => {
      const valores = [{ valor: 110, fecha: 1600631914000, postprandial: 'false' }];
      const res = await request(app)
        .post('/medicionConstanteVital/glucemia')
        .send({
          valores,
        });
      expect(JSON.parse(res.text)).toEqual({
        ok: false,
        err: {
          message: 'El formato introducido de las mediciones no es correcto. Todas las mediciones deben tener \'valor\' (Number), \'fecha\' en milisegundos (Number), \'postprandial\' (Boolean)',
        },
      });
    });
  });
});
