import { environment } from 'src/environments/environment';

export class Usuario {
    constructor(
        public estado: boolean, 
        public _id: string,
        public Nombre: string, 
        public Apellido: string, 
        public Correo: string,
        public Departamento:string,
        public Role?: string,
    ) {}
}