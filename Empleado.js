export default class Empleado {
    #id;
    #nombre;
    #apellido;
    #puesto;
    #zonaAsignada;
    #fechaIngreso;
    #salario;

    constructor(id, nombre, apellido, puesto, zonaAsignada, fechaIngreso, salario) {
        const puestosValidos = ["Gerente", "Supervisor", "Operario"];
        if (!puestosValidos.includes(puesto)) {
            throw new Error(`Fallo de seguridad: El puesto '${puesto}' no existe en la jerarquía del supermercado.`);
        }//Valida que el puesto sea uno de los permitidos, si no, muestra error
        this.#id = id;
        this.#nombre = nombre;
        this.#apellido = apellido;
        this.#puesto = puesto;
        this.#zonaAsignada = zonaAsignada;
        this.#fechaIngreso = fechaIngreso;
        this.#salario = salario;
    }

    getId() { return this.#id; }
    getNombre() { return this.#nombre; }
    getApellido() { return this.#apellido; }
    getPuesto() { return this.#puesto; }
    getZonaAsignada() { return this.#zonaAsignada; }
    getFechaIngreso() { return this.#fechaIngreso; }
    getSalario() { return this.#salario; }
}