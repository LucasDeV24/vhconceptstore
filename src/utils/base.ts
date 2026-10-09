/** Caminho de um arquivo da pasta public, respeitando a pasta onde o site foi publicado (ex.: /vhconceptstore/). */
export const asset = (caminho: string) => `${import.meta.env.BASE_URL}${caminho.replace(/^\//, "")}`;
