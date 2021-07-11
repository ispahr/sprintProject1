
let usuarios = [ 
    {   
        userName: "pepito10",
        name: "Pepito Lopez",
        email: "pepito@gmail.com",
        phoneNumber: "1512345678",
        adrress: "Calle falsa 123",
        password: "123456",
        admin: false
    },
    {   
        userName: "soyadmin",
        name: "Juan Perez",
        email: "juan@gmail.com",
        phoneNumber: "1512345678",
        adrress: "Calle falsa 123",
        password: "password",
        admin: true
    },
];

let logueado = {
    usuario: {},
    sign_in: false
}

let pedidos = [
    {   
        pedidoID: 100,
        usuario:
            {
                userName: "pepito10",
                name: "Pepito Lopez",
                email: "pepito@gmail.com",
                phoneNumber: "1512345678",
                adrress: "Calle falsa 123",
                password: "123456",
                admin: false
            },
        estado: 'pendiente',
        productos: [
            {
                platoID: 1,
                cantidad: 2,
                precio: 50
            }
        ],
        costo_total: 100

    }
];

let productos = [
    {
        plato: 'hamburguesa',
        platoID: 0,
        precio: 100
    },
    {
        plato: 'papas fritas',
        platoID: 1,
        precio: 50
    },
    {
        plato: 'agua',
        platoID: 2,
        precio: 50
    },
];

let medios_pago = {
    1:'Tarjeta de credito',
    2:'Tarjeta de debito',
    3:'Efectivo',
    4:'Transferencia Bancaria'
};

module.exports = {
    usuarios,
    pedidos,
    logueado,
    productos,
    medios_pago
}