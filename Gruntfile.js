module.exports = function (grunt) {
  // Configuración mínima
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    // Puedes agregar aquí tareas si las necesitas más adelante
  });

  // Registrar una tarea por defecto vacía para que no falle
  grunt.registerTask("default", []);
};
