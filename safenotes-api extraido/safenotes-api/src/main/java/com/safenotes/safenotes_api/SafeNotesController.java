package com.safenotes.safenotes_api;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SafeNotesController {

    private final Map<Long, Map<String, Object>> notas = new ConcurrentHashMap<>();
    private final AtomicLong secuenciaId = new AtomicLong(3);

    public SafeNotesController() {
        notas.put(2L, crearMapaNota(2L, "Revisar apuntes de clase y organizar tareas de la semana", "Estudio", false));
        notas.put(3L, crearMapaNota(3L, "Preparar entrega del proyecto Safe Note y respaldar cambios", "Trabajo", true));
    }

    private Map<String, Object> crearMapaNota(Long id, String texto, String categoria, boolean importante) {
        Map<String, Object> nota = new HashMap<>();
        nota.put("id", id);
        nota.put("texto", texto);
        nota.put("categoria", categoria);
        nota.put("importante", importante);
        return nota;
    }

    @GetMapping("/estado")
    public Map<String, String> estado() {
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("proyecto", "Safe Notes");
        respuesta.put("estado", "API REST activa y conectada a MySQL");
        return respuesta;
    }

 @GetMapping("/notas")
    public List listarNotas() {
        return new ArrayList(notas.values());
    }
    
    @GetMapping("/notas/{id}")
    public ResponseEntity<Object> obtenerNotaPorId(@PathVariable Long id) {
        Map<String, Object> nota = notas.get(id);
        if (nota == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "No existe una nota con el id " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        return ResponseEntity.ok(nota);
    }

    @PostMapping("/notas")
    public ResponseEntity<Object> crearNota(@RequestBody Map<String, Object> body) {
        Long nuevoId = secuenciaId.incrementAndGet();
        String texto = body.get("texto") != null ? body.get("texto").toString() : "";
        String categoria = body.get("categoria") != null ? body.get("categoria").toString() : "General";

        Object valImportante = body.get("importante");
        boolean importante = (valImportante instanceof Boolean) ? (Boolean) valImportante : false;

        Map<String, Object> creada = crearMapaNota(nuevoId, texto, categoria, importante);
        notas.put(nuevoId, creada);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @PutMapping("/notas/{id}")
    public ResponseEntity<Object> actualizarNota(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Map<String, Object> existente = notas.get(id);
        if (existente == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "No existe una nota con el id " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        if (body.containsKey("texto") && body.get("texto") != null) {
            existente.put("texto", body.get("texto").toString());
        }
        if (body.containsKey("categoria") && body.get("categoria") != null) {
            existente.put("categoria", body.get("categoria").toString());
        }
        if (body.containsKey("importante") && body.get("importante") instanceof Boolean) {
            existente.put("importante", (Boolean) body.get("importante"));
        }

        return ResponseEntity.ok(existente);
    }

    @DeleteMapping("/notas/{id}")
    public ResponseEntity<Object> eliminarNota(@PathVariable Long id) {
        if (notas.remove(id) == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "No existe una nota con el id " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        return ResponseEntity.noContent().build();
    }
}