import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { CreateCoffeeDto } from '../../src/coffees/dto/create-coffee.dto';
import { UpdateCoffeeDto } from '../../src/coffees/dto/update-coffee.dto';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { TimeoutInterceptor } from '../../src/common/interceptors/timeout.interceptor';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };
  const expectedPartialCoffee = expect.objectContaining({
    ...coffee,
    flavors: expect.arrayContaining(
      coffee.flavors.map((name) => expect.objectContaining({ name })),
    ),
  });
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'admin',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TimeoutInterceptor());

    await app.init();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body).toEqual(expectedPartialCoffee);
      });
  });
  it('Get all [GET /]', () => {
    return request(app.getHttpServer())
      .get('/coffees')
      .then(({ body }) => {
        console.log(body);
        expect(body.length).toBeGreaterThan(0);
        expect(body[0]).toEqual(expectedPartialCoffee);
      });
  });
  it('Get one [GET /:id]', () => {
    return request(app.getHttpServer())
      .get('/coffees/1')
      .then(({ body }) => {
        expect(body).toEqual(expectedPartialCoffee);
      });
  });
  it('Update one [PATCH /:id]', () => {
    const updateCoffeeDto: UpdateCoffeeDto = {
      ...coffee,
      name: 'New and Improved Shipwreck Roast',
    };
    return request(app.getHttpServer())
      .patch('/coffees/1')
      .send(updateCoffeeDto)
      .then(({ body }) => {
        expect(body.name).toEqual(updateCoffeeDto.name);

        return request(app.getHttpServer())
          .get('/coffees/1')
          .then(({ body }) => {
            expect(body.name).toEqual(updateCoffeeDto.name);
          });
      });
  });
  it('Delete one [DELETE /:id]', () => {
    return request(app.getHttpServer())
      .delete('/coffees/1')
      .expect(HttpStatus.OK)
      .then(() => {
        return request(app.getHttpServer())
          .get('/coffees/4')
          .expect(HttpStatus.NOT_FOUND);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
