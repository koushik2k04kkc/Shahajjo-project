const provider={bkash:'বিকাশ',nagad:'নগদ',rocket:'রকেট'}
export function formatBanglishAlert(alert,language='en'){if(language!=='bn')return alert;return {...alert,provider:provider[alert.provider?.toLowerCase()]||alert.provider,titleBn:alert.titleBn||alert.title,situationBn:alert.situationBn||alert.situation,actionBn:alert.actionBn||alert.action}}
