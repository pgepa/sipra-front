export interface ProtestoData {
    cda: string;
    contribuinte: string;
    docformatado: string;
    doc_raiz: string;
    tipodoc: string;
    natjuridica: string | null;
    porte: string | null;
    situacaocadastral: string | null;
    dtsituacaocadastral: string | null;
    dtinicioatividade: string | null;
    capitalsocial: string | null;
    descricao: string | null;
    dtinscricao: string;
    dtreferencia: string;
    tipotributo: string;
    fundamento: string;
    origemdivida: string;
    vlcdaoriginal: number;
    vlmultaatualizada: number;
    vljurosatualizado: number;
    vlimpatualizado: number;
    vlcdaatualizado: number;
    statusdebito: string;
    dtstatus: string;
    flajuizada: string;
    sit_protesto: string;
    parcelamento: string;
    prescrito: string;
    obs_end_protesto: string;
    periodoprotesto: string;
    uf: string;
    municipio: string;
}

export interface ProtestoFilterState {
    nudocumento: string;
    contribuinte: string;
    municipio: string;
    tipodoc: string;
    natjuridica: string;
    porte: string[];
    situacaocadastral: string[];
    tipotributo: string[];
    fundamento: string;
    vlcdaatualizado_min: string;
    vlcdaatualizado_max: string;
    statusdebito: string[];
    flajuizada: string;
    prescrito: string[];
    obs_end_protesto: string;
    origemdivida: string;
    sit_protesto: string[];
    uf: string[];
}
