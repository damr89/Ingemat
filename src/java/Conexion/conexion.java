
package Conexion;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import javax.swing.JOptionPane;
/**
 *
 * @author Murga
 */
public class conexion {
    public static Connection conectar(){
        try {
            Connection cn = DriverManager.getConnection("jdbc:mysql://localhost/bd_ingemat1","root","2819");
            
            JOptionPane.showMessageDialog(null, "✅ Conexión exitosa a la base de datos");
            return cn;
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(null, "❌ Error en la conexión: '" + ex.toString() + "'");
        }
        return null;
    }
    
}
