import { ApiEvent, Event } from "../types/event";
import { api } from "./api";

const imageNotFoundUrl = "https://img.freepik.com/vetores-premium/vector-de-design-de-personagens-de-mascota-de-pasta-de-arquivo_166742-4413.jpg"

export async function buscarEventos() {
    const resposta = await api.get<ApiEvent[]>("/public/events")

    if (resposta.status === 200) {
        return resposta.data.map((item) => {
            let imagemEvento: string;

            if (item.photos.length === 0) {
                imagemEvento = imageNotFoundUrl;
            }else {
                imagemEvento = item.photos[0] // Pegar a primeira imagem
            }

            const eventFormatado: Event = {
                id: item.id.toString(),
                data: item.initialDate,
                local: item.location,
                titulo: item.name,
                preco: item.ticketPrice.toString(),
                imagem: imagemEvento
            }

            return eventFormatado;
        });
    }

    throw new Error("Servidor respondeu com um status inesperado:" + resposta.status);    
}

export async function buscarEventoPorId(id: string) {
    const resposta = await api.get<ApiEvent>(`/public/events/${id}`)

    if (resposta.status === 200) {
        let imagemEvento: string;

        // getEventImage(resposta.data);
        if (resposta.data.photos.length === 0) {
            imagemEvento = imageNotFoundUrl;
        }else {
            imagemEvento = resposta.data.photos[0] // Pegar a primeira imagem
        }

        const eventFormatado: Event = {
            id: resposta.data.id.toString(),
            titulo: resposta.data.name,
            data: resposta.data.initialDate,
            local: resposta.data.location,
            preco: resposta.data.ticketPrice.toString(),
            imagem: imagemEvento
        }

        return eventFormatado;
    }

    throw new Error("Status code desconhecido:" + resposta.status)
}