import { ApiEvent, Event } from "../types/event";
import { api } from "./api";

export async function buscarEventos() {
    const resposta = await api.get<ApiEvent[]>("/public/events")

    if (resposta.status === 200) {
        return resposta.data.map((item) => {
            const eventFormatado: Event = {
                id: item.id.toString(),
                data: item.initialDate,
                local: item.location,
                titulo: item.name,
                preco: item.ticketPrice.toString(),
                imagem: item.photos[0] ?? "https://viaplaceholder.com/600X400"
            }

            return eventFormatado;
        });
    }

    throw new Error("Servidor respondeu com um status inesperado:" + resposta.status);    
}