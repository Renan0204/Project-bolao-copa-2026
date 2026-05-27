export type ApiEvent = {
    id: number;
    name: string;
    description: string;
    initialDate: string;
    finalDate: string;
    location: string;
    maxTickets: number;
    ticketPrice: number;
    photos: string[];
}

export type Event = {
    id: string;
    titulo: string;
    data: string;
    local: string;
    preco: string;
    imagem: string;
}