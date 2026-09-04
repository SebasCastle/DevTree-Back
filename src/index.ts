import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); 


import colors from 'colors'
import server from './config/server'

const port = process.env.PORT || 4000

//herencia
// interface Product {
//     id: number;
//     price: number;
// }

// type cantidad = Product & {
//     cant: number;
//     size: number;
// }
console.log('******** INDEX NUEVO ********');

server.listen(port, () =>{
    console.log(colors.bgBlue.magenta.bold('servidor iniciado..., puerto:'), port)
})



