export interface ProtestoData {
    cda: string;
    contribuinte: string;
    docformatado: string;
    docraiz: string;
    tpdoc: string;
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
    cdprocesso: string;
    obs_ulthist: string;
    indiciopatrimonial: string;
    qtdveiculos: string;
    qtdsemas: string;
    qtdadepara: string;
    documento: string;
    vlconsolidado: number;
}

export interface FilterState {
    documento: string;
    contribuinte: string;
    tpdoc: string;
    docraiz: string;
    porte: string[];
    situacaocadastral: string[];
    tipotributo: string[];
    vlconsolidado_min: string;
    vlconsolidado_max: string;
    statusdebito: string[];
    parcelamento: string;
    prescrito: string[];
    origemdivida: string;
    indiciopatrimonial: string;
    sit_protesto: string[];
}
