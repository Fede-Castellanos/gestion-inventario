import ProductoFrio from './ProductoFrio.js';
import ProductoCaliente from './ProductoCaliente.js';
import Zona from './Zona.js';
import GestorInventario from './GestorInventario.js';
import GestorDescuentos from './GestorDescuentos.js';
import Empleado from './Empleado.js';


const politicasComerciales = new GestorDescuentos();
politicasComerciales.agregarDescuento("Argentina", 0.90);
politicasComerciales.agregarDescuento("Brasil", 0.85);

const miSupermercado = new GestorInventario(politicasComerciales);

const gondolaSecos = new Zona(101, "Pasillo Central", 500, false);
const camaraLacteos = new Zona(102, "Heladeras Fondo", 100, true);
miSupermercado.agregarZona(gondolaSecos);
miSupermercado.agregarZona(camaraLacteos);

const empleado1 = new Empleado(4432, "Juan", "Perez", "Gerente", "Pasillo Central", new Date(2020, 5, 15), 80000);

const fideo = new ProductoCaliente(1, "Fideos Mostachol", "no perecedero", false, 1200, 50, new Date(2026, 10, 20), "L001", "Argentina", "Molinos Rio de la Plata", 25588751746);
const leche = new ProductoFrio(2, "Leche Entera", "perecedero", true, 900, 20, new Date(2026, 11, 20), "L002", "Uruguay", "Conaprole", 4, 25588751747);

miSupermercado.agregarProducto(101, fideo, empleado1);
miSupermercado.agregarProducto(102, leche, empleado1);


miSupermercado.venderProducto(25588751746, empleado1);

console.log(miSupermercado.calcularValorTotal());