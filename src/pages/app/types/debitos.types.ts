export interface DadosCDA {
    cda: string;
    dtinscricao: string;
    dtreferencia: string;
    contribuinte: string;
    tipoimposto: string;
    origemdivida: string;
    fundamento: string;
    statusdebito: string;
    vlcdaatualizado: number;
    dtatualizacaosaldo: string;
    prescrito: string;
    flajuizada: string;
    dtajuizamento: string;
    sit_protesto: string;
    placa: string;
}

export interface HistoricoCDA {
    situacao: string;
    dtsituacao: string;
    cdusuinclusao: string;
    observacao: string;
    num_seq: string;
}

export interface ParcelamentoCDA {
    parcelamento: string;
    dtparcelamento: string;
    nuparcelas: string;
    regraparcelamento: string;
    observparcelamento: string;
    sitparcelamento: string;
    dtterminopar: string;
    seqparc: string;
}

export interface DebitoData {
    HistoricoCDA: HistoricoCDA[];
    DadosCDA: DadosCDA[];
    ParcelamentoCDA: ParcelamentoCDA[];
}

export interface DebitoFilterState {
    cda: string;
    documento: string;
}
