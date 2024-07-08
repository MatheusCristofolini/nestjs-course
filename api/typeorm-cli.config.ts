import { Coffee } from 'src/coffees/entities/coffee.entity';
import { Flavor } from 'src/coffees/entities/flavor.entity';
import { CoffeeRefactor1720469884821 } from 'src/migrations/1720469884821-CoffeeRefactor';
import { SchemaSync1720471781478 } from 'src/migrations/1720471781478-SchemaSync';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'postgres',
  entities: [Coffee, Flavor],
  migrations: [CoffeeRefactor1720469884821, SchemaSync1720471781478],
});
