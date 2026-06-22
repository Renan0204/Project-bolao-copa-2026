import { Partida } from "./partida";

export type Palpite = {
  id: number;
  golsSelecaoA: number;
  golsSelecaoB: number;
  pontos?: number;
  criterioPontuacao?: string;
  criadoEm?: string;
  partida?: Partial<Partida>; 
};