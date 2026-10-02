import Producto from'./Producto.js';
import GestorInventario from './GestorInventario.js';

const fideo = new Producto(1, "Fideos Mostachol", "no perecedero", false, 1200, 50, new Date(2026, 10, 20));
const leche = new Producto(2, "Leche Entera", "perecedero", true, 900, 20, new Date(2026, 11, 20));

const miSupermercado = new GestorInventario();
miSupermercado.agregarProducto(fideo);
miSupermercado.agregarProducto(leche);

console.log(miSupermercado.calcularValorTotal());