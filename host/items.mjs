const defaults=[{id:'burst',name:'Bloom bomb',price:12,description:'Explodes on impact, clearing nearby targets.'},{id:'pierce',name:'Star feather',price:10,description:'Pierces stone and wood with two-hit strength.'},{id:'extra',name:'Extra flight',price:8,description:'One more flight. Up to three per island attempt.'}];
export function install({app,account,runtimeFetch,runtimeUrl,runtimeToken}){
 app.get('/games/sling/api/items',async(req,res)=>{
  try{
   const user=account(req);let state;
   if(user){const r=await runtimeFetch(runtimeUrl+'/api/state',{headers:{'X-Runtime-Token':runtimeToken,'X-UTXOPlay-Account':user.id},signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('Inventory unavailable');state=(await r.json()).game;}
   res.json({balance:state?.coins??null,items:(state?.shop.items||defaults).map((i,index)=>({id:i.id,name:i.name,desc:i.description,type:'Consumable',price:i.price,owned:state?i.owned:null,maxOwned:3,image:'/games/sling/assets/garden-sprites.webp',sprite:{size:'400% 300%',position:`${index*33.333333}% 100%`}}))});
  }catch{res.status(503).json({error:'Inventory unavailable. Open the game to reconnect.'});}
 });
 return {close(){}};
}
