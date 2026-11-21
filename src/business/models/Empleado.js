export default class Empleado {
    #id;
    #nombre;
    #apellido;
    #puesto;
    #zonaAsignada;
    #fechaIngreso;
    #salario;

    constructor(id, nombre, apellido, puesto, zonaAsignada, fechaIngreso, salario) {
        const puestosValidos = ["Gerente", "Supervisor", "Operario", "Cajero"];
        if (!puestosValidos.includes(puesto)) {
            throw new Error(`Fallo de seguridad: El puesto '${puesto}' no existe en la jerarquía del supermercado.`);
        }
        this.#id = id;
        this.#nombre = nombre;
        this.#apellido = apellido;
        this.#puesto = puesto;
        this.#zonaAsignada = zonaAsignada || 'Sin asignar';
        this.#fechaIngreso = fechaIngreso ? new Date(fechaIngreso) : new Date();
        this.#salario = Number(salario) || 0;
    }

    getId() { return this.#id; }
    getNombre() { return this.#nombre; }
    getApellido() { return this.#apellido; }
    getNombreCompleto() { return `${this.#nombre} ${this.#apellido}`; }
    getPuesto() { return this.#puesto; }
    getZonaAsignada() { return this.#zonaAsignada; }
    getFechaIngreso() { return this.#fechaIngreso; }
    getSalario() { return this.#salario; }

    puedeAgregarProductos() {
        return this.#puesto === "Gerente" || this.#puesto === "Supervisor";
    }

    puedeOperarCaja() {
        return this.#puesto === "Cajero" || this.#puesto === "Gerente";
    }

    toJSON() {
        return {
            id: this.#id,
            nombre: this.#nombre,
            apellido: this.#apellido,
            nombreCompleto: this.getNombreCompleto(),
            puesto: this.#puesto,
            zonaAsignada: this.#zonaAsignada,
            fechaIngreso: this.#fechaIngreso.toISOString().split('T')[0],
            salario: this.#salario
        };
    }
}
