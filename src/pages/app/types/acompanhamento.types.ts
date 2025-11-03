export interface AcompanhamentoData {
    apensamento: string;
    atualizadoem: string;
    data_ajuizamento: string;
    fluxo: string;
    idprocesso: string;
    materia: string;
    tpprocesso: string;
    motivo: string;
    qualificacao: string;
    cdprocesso: string;
    idprocessoapensado: string | null;
    chefia: string;
    classe: string;
    judicialapensado: string | null;
    numformatado: string;
    numprocesso: string;
    orgao: string;
    nvprocesso: string;
    processoapensado: string | null;
    procuradoria: string;
    qtdcdas: number;
    somavlcdas: string;
    status: string;
    juizo: string;
    vlacao: string;
    pdf_links?: string[];
    pdf_links_cnpj?: string[];
    indicio: string | null;
    AE: boolean;
    parteprincipal: string;
    mesaprocurador: string;
    assuntoinstituicao: string;
    demandaaberta: string;
    comarca: string;
    vlprocesso: string;
}

export interface AcompanhamentoFilterState {
    numformatado: string;
    comarca: string;
    vlprocesso_min: string;
    vlprocesso_max: string;
    indicio: string;
    falenciarecuperacao: string;
    flembargos: string;
}
