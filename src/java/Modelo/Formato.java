package Modelo;

public class Formato {
    private int id;
    private int idCategoria; // Para la relación con Categoria
    private String nombre;
    private String codigo;   // Campo de código para el formato
    private double precio;   // Campo de precio para el formato

    public Formato() {
    }

    public Formato(int id, int idCategoria, String nombre, String codigo, double precio) {
        this.id = id;
        this.idCategoria = idCategoria;
        this.nombre = nombre;
        this.codigo = codigo;
        this.precio = precio;
    }

    // Getters y Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(int idCategoria) {
        this.idCategoria = idCategoria;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    @Override
    public String toString() {
        return "Formato{" +
               "id=" + id +
               ", idCategoria=" + idCategoria +
               ", nombre='" + nombre + '\'' +
               ", codigo='" + codigo + '\'' +
               ", precio=" + precio +
               '}';
    }
}