export const paginate=<T extends {id:string|number}>(items:T[],cursor:string|number|null,limit:number)=>{
  let startIndex=0
  if(cursor){
    startIndex=items.findIndex(item=>item.id===cursor)+1
  }
  const slicedItems=items.slice(startIndex,startIndex+limit);
  const endCursor=slicedItems.length>0?slicedItems[slicedItems.length-1].id:null

  return{
    items:slicedItems,
    pageInfo:{
      endCursor,
      hasNextPage:startIndex+limit<items.length
    }
  }
}









// type User = {
//     id: string;
//     name: string;
//     email: string;
//   };
  
//   export const paginate = (items: User[], cursor: string | null, limit: number) => {
//     let startIndex = 0;
  
//     if (cursor) {
//       startIndex = items.findIndex(item => item.id === cursor) + 1;
//     }
  
//     const slicedItems = items.slice(startIndex, startIndex + limit);
//     const endCursor = slicedItems.length > 0 ? slicedItems[slicedItems.length - 1].id : null;
  
//     return {
//       items: slicedItems,
//       pageInfo: {
//         endCursor,
//         hasNextPage: startIndex + limit < items.length,
//       },
//     };
//   };
  