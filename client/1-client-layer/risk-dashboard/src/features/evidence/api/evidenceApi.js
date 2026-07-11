import{apiGet}from'../../../lib/apiClient';export const getEvidence=(id,signal)=>apiGet(`/evidence/${id}`,{signal})
