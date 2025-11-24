import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '12345',
    database: 'bd252',
});

async function checkEstados() {
    await AppDataSource.initialize();

    const estados = await AppDataSource.query('SELECT * FROM shared.estadooperacion');
    console.log('Estados disponibles:');
    console.table(estados);

    const estatusNav = await AppDataSource.query('SELECT * FROM shared.estatusnavegacion');
    console.log('\nEstatus de navegación disponibles:');
    console.table(estatusNav);

    await AppDataSource.destroy();
}

checkEstados().catch(console.error);
