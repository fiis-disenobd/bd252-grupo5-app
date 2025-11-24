
import { DataSource } from "typeorm";
import { ContenedorMercancia } from "./backend/src/shared/entities/contenedor-mercancia.entity";
import { Contenedor } from "./backend/src/shared/entities/contenedor.entity";

const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password", // Assuming default or I need to find it
    database: "bd252_grupo5", // I need to verify the DB name
    entities: [ContenedorMercancia, Contenedor],
    synchronize: false,
});

async function checkData() {
    try {
        await dataSource.initialize();
        console.log("Connected to DB");

        const mercancias = await dataSource.getRepository(ContenedorMercancia).find({
            relations: ['contenedor']
        });
        console.log("Total ContenedorMercancia records:", mercancias.length);
        if (mercancias.length > 0) {
            console.log("Sample:", mercancias[0]);
        } else {
            console.log("No merchandise records found.");
        }

        const contenedores = await dataSource.getRepository(Contenedor).find();
        console.log("Total Contenedor records:", contenedores.length);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await dataSource.destroy();
    }
}

checkData();
