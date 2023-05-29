// export const cleanseObject = (obj) => {
//   // let stop = false

//   let deep = 0
//   const map = (obj, currentDeep) => {
//     if (currentDeep > deep) {
//       deep = currentDeep
//     }

//     Object.keys(obj).forEach((key) => {
//       if (obj[key] === undefined || obj[key] === null) {
//         delete obj[key]
//       } else if (typeof obj[key] === 'object') {
//         if (Object.keys(obj[key]).length === 0) {
//           delete obj[key]
//         } else {
//           map(obj[key], currentDeep + 1)
//         }
//       }
//     })

//     return currentDeep
//   }

//   const deepCloneobj = cloneDeep(obj, 1)

//   // while (!stop) {
//   map(deepCloneobj)
//   console.log('deep---------', deep)
//   // }

//   if (deepCloneobj?.legend?.visible === false) {
//     deepCloneobj.legend = false
//   }

//   return deepCloneobj
// }
