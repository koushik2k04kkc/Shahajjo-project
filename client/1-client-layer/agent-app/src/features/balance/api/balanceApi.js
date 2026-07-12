import { request } from '../../../lib/apiClient'
export const getUnifiedBalance=(agentId,signal)=>request(`/agents/${agentId}/overview`,{signal})
export const getBalanceHistory=(agentId,signal)=>request(`/agents/${agentId}/liquidity`,{signal})
export const getTransactionHistory=(agentId,signal)=>request(`/transactions/agent/${agentId}`,{signal})
