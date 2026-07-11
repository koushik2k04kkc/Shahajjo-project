import { useQuery } from '@tanstack/react-query'
import { getUnifiedBalance } from '../api/balanceApi'
export const demoBalance={total:573700,cash:326400,cashIn:412800,cashOut:366200,providers:[{id:'bkash',name:'bKash',amount:184500,color:'#C6006F',trend:'+4.8%',updated:'now',confidence:96},{id:'nagad',name:'Nagad',amount:62800,color:'#F58220',trend:'-12.4%',updated:'2m',confidence:87,shortageIn:'~3 hrs to shortage'},{id:'rocket',name:'Rocket',amount:null,color:'#6F2C91',delayed:18,updated:'18m',confidence:42}]}
export function useUnifiedBalance(agentId){return useQuery({queryKey:['balance',agentId],queryFn:({signal})=>getUnifiedBalance(agentId,signal),select:r=>r.data||r,placeholderData:demoBalance})}
