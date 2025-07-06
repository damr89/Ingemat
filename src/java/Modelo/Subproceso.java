package Modelo;

public class Subproceso {
    private int id;
    private int idFormato;
    private String nombre; // <<-- ¡Asegúrate de que esta línea exista!
    private int estado; // O el tipo de dato que uses para 'estado'

    public Subproceso() {
    }

    public Subproceso(int id, int idFormato, String nombre, int estado) {
        this.id = id;
        this.idFormato = idFormato;
        this.nombre = nombre;
        this.estado = estado;
    }

    // Getters
    public int getId() {
        return id;
    }

    public int getIdFormato() {
        return idFormato;
    }

    public String getNombre() {
        return nombre;
    }

    public int getEstado() {
        return estado;
    }

    // Setters
    public void setId(int id) {
        this.id = id;
    }

    public void setIdFormato(int idFormato) {
        this.idFormato = idFormato;
    }

    public void setNombre(String nombre) { // <<-- ¡Este método debe existir exactamente así!
        this.nombre = nombre;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "Subproceso{" +
               "id=" + id +
               ", idFormato=" + idFormato +
               ", nombre='" + nombre + '\'' +
               ", estado=" + estado +
               '}';
    }
}