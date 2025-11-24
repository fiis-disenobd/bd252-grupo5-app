import OperacionForm from "@/components/operaciones-maritimas/OperacionForm";

type Buque = {
  id_buque: string;
  matricula: string;
  nombre: string;
  capacidad: number;
  peso: number | string;
  ubicacion_actual: string | null;
};

type NuevaOperacionMaritimaPageProps = {
  searchParams: Promise<{
    id_buque?: string;
    routeId?: string;
    routeCode?: string;
    originName?: string;
    destinationName?: string;
    distance?: string;
    duration?: string;
    originDockCode?: string;
    destinationDockCode?: string;
    contenedores?: string;
    tripulacion?: string;
  }>;
};

export default async function NuevaOperacionMaritimaPage({
  searchParams,
}: NuevaOperacionMaritimaPageProps) {
  const resolvedSearchParams = await searchParams;
  const idBuque = resolvedSearchParams.id_buque;

  let buque: Buque | null = null;

  if (idBuque) {
    try {
      const response = await fetch(
        `http://localhost:3001/monitoreo/buques/${idBuque}`,
        { cache: "no-store" }
      );
      if (response.ok) {
        buque = (await response.json()) as Buque | null;
      }
    } catch (error) {
      console.error("Error al obtener buque para la operación:", error);
    }
  }

  return (
    <OperacionForm buque={buque} searchParams={resolvedSearchParams} />
  );
}
