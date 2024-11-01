<!DOCTYPE html>
<html lang="es">
   <head>

   </head>
   <body>
      <h1>Proyecto Web - Arco da Vella</h1>
      <div class="center">
         <img src="src/assets/preview/logo.png" width="150" alt="Logo de Arco da Vella"> 
         <div class="badges"> <a href="#"> <img height="24" src="https://img.shields.io/badge/Angular-15-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 15"> </a> <a href="#"> <img height="24" src="https://img.shields.io/badge/Node.js-18.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 18.0.0"> </a> <a href="#"> <img height="24" src="https://img.shields.io/badge/Docker-20.10.7-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker 20.10.7"> </a> </div>
      </div>
      <h2>Motivación</h2>
      <p> El proyecto <strong>Arco da Vella</strong> es una aplicación web completa que consta de un frontend desarrollado con <strong>Angular</strong> y un backend construido con <strong>Node.js</strong> y <strong>Express</strong>. El objetivo principal es ofrecer una plataforma interactiva y eficiente para los usuarios, aprovechando tecnologías modernas y prácticas recomendadas en el desarrollo web. </p>
      <p> Este proyecto también integra herramientas como <strong>Docker</strong>, <strong>Plesk</strong> y <strong>Jenkins</strong> para facilitar el despliegue, la integración continua y el mantenimiento de la aplicación en entornos de producción. </p>
      <h2>Versiones</h2>
      <ul>
         <li><strong>Angular:</strong> 15</li>
         <li><strong>Node.js:</strong> 18.x</li>
         <li><strong>Docker:</strong> 20.x</li>
         <li><strong>Jenkins:</strong> 2.x</li>
         <li><strong>Plesk:</strong> Última versión compatible</li>
      </ul>
      <h2>Características</h2>
      <ul>
         <li>Frontend desarrollado con Angular</li>
         <li>Backend API con Node.js y Express</li>
         <li>Base de datos integrada con MongoDB</li>
         <li>Contenedores Docker para despliegue sencillo</li>
         <li>Despliegue automático en Plesk</li>
         <li>Integración y despliegue continuos (CI/CD) con Jenkins</li>
         <li>Autenticación y autorización de usuarios</li>
         <li>Interfaz responsiva y amigable</li>
         <li>Manejo de variables de entorno para mayor seguridad</li>
         <li>Pruebas unitarias y de integración</li>
         <li>Documentación de la API</li>
         <li>Implementación de guardas y middleware adicionales</li>
      </ul>
      <h2>Comandos</h2>
      <h3>Frontend</h3>
      <div class="commands">
         <table>
            <tr>
               <th>Comando</th>
               <th>Descripción</th>
            </tr>
            <tr>
               <td><code>npm install</code></td>
               <td>Instala las dependencias del proyecto</td>
            </tr>
            <tr>
               <td><code>ng serve</code></td>
               <td>Inicia la aplicación Angular en modo desarrollo</td>
            </tr>
            <tr>
               <td><code>ng build</code></td>
               <td>Compila la aplicación para producción</td>
            </tr>
            <tr>
               <td><code>ng test</code></td>
               <td>Ejecuta las pruebas unitarias</td>
            </tr>
            <tr>
               <td><code>ng e2e</code></td>
               <td>Ejecuta las pruebas end-to-end</td>
            </tr>
         </table>
      </div>
      <h3>Backend</h3>
      <div class="commands">
         <table>
            <tr>
               <th>Comando</th>
               <th>Descripción</th>
            </tr>
            <tr>
               <td><code>npm install</code></td>
               <td>Instala las dependencias del proyecto</td>
            </tr>
            <tr>
               <td><code>npm start</code></td>
               <td>Inicia el servidor en modo desarrollo</td>
            </tr>
            <tr>
               <td><code>npm run build</code></td>
               <td>Compila el proyecto para producción</td>
            </tr>
            <tr>
               <td><code>npm test</code></td>
               <td>Ejecuta las pruebas unitarias</td>
            </tr>
         </table>
      </div>
      <h3>Docker</h3>
      <div class="commands">
         <table>
            <tr>
               <th>Comando</th>
               <th>Descripción</th>
            </tr>
            <tr>
               <td><code>docker build -t arcodavella .</code></td>
               <td>Construye la imagen Docker de la aplicación</td>
            </tr>
            <tr>
               <td><code>docker run -p 80:80 arcodavella</code></td>
               <td>Ejecuta el contenedor Docker en el puerto 80</td>
            </tr>
            <tr>
               <td><code>docker-compose up</code></td>
               <td>Levanta todos los servicios definidos en Docker Compose</td>
            </tr>
         </table>
      </div>
      <h2>Dependencias</h2>
      <h3>Frontend</h3>
      <div class="dependencies">
         <table>
            <tr>
               <th>Paquete</th>
               <th>Descripción</th>
               <th>Enlace</th>
            </tr>
            <tr>
               <td><code>@angular/core</code></td>
               <td>Framework para construir aplicaciones web dinámicas</td>
               <td><a href="https://www.npmjs.com/package/@angular/core">NPM</a></td>
            </tr>
            <tr>
               <td><code>rxjs</code></td>
               <td>Biblioteca para programación reactiva</td>
               <td><a href="https://www.npmjs.com/package/rxjs">NPM</a></td>
            </tr>
            <tr>
               <td><code>ngx-toastr</code></td>
               <td>Notificaciones y mensajes emergentes</td>
               <td><a href="https://www.npmjs.com/package/ngx-toastr">NPM</a></td>
            </tr>
            <tr>
               <td><code>angular-material</code></td>
               <td>Componentes UI para Angular</td>
               <td><a href="https://www.npmjs.com/package/@angular/material">NPM</a></td>
            </tr>
         </table>
      </div>
      <h3>Backend</h3>
      <div class="dependencies">
         <table>
            <tr>
               <th>Paquete</th>
               <th>Descripción</th>
               <th>Enlace</th>
            </tr>
            <tr>
               <td><code>express</code></td>
               <td>Framework web para Node.js</td>
               <td><a href="https://www.npmjs.com/package/express">NPM</a></td>
            </tr>
            <tr>
               <td><code>mongoose</code></td>
               <td>ODM para MongoDB y Node.js</td>
               <td><a href="https://www.npmjs.com/package/mongoose">NPM</a></td>
            </tr>
            <tr>
               <td><code>cors</code></td>
               <td>Middleware para habilitar CORS</td>
               <td><a href="https://www.npmjs.com/package/cors">NPM</a></td>
            </tr>
            <tr>
               <td><code>dotenv</code></td>
               <td>Carga variables de entorno desde un archivo <code>.env</code></td>
               <td><a href="https://www.npmjs.com/package/dotenv">NPM</a></td>
            </tr>
            <tr>
               <td><code>jsonwebtoken</code></td>
               <td>Implementación de JSON Web Tokens para autenticación</td>
               <td><a href="https://www.npmjs.com/package/jsonwebtoken">NPM</a></td>
            </tr>
            <tr>
               <td><code>bcrypt</code></td>
               <td>Biblioteca para encriptar contraseñas</td>
               <td><a href="https://www.npmjs.com/package/bcrypt">NPM</a></td>
            </tr>
         </table>
      </div>
      <h2>Dependencias de Desarrollo</h2>
      <div class="dependencies">
         <table>
            <tr>
               <th>Paquete</th>
               <th>Descripción</th>
               <th>Enlace</th>
            </tr>
            <tr>
               <td><code>nodemon</code></td>
               <td>Reinicia automáticamente el servidor en desarrollo</td>
               <td><a href="https://www.npmjs.com/package/nodemon">NPM</a></td>
            </tr>
            <tr>
               <td><code>eslint</code></td>
               <td>Herramienta para encontrar y arreglar problemas en el código</td>
               <td><a href="https://www.npmjs.com/package/eslint">NPM</a></td>
            </tr>
            <tr>
               <td><code>prettier</code></td>
               <td>Formateador de código para mantener un estilo consistente</td>
               <td><a href="https://www.npmjs.com/package/prettier">NPM</a></td>
            </tr>
            <tr>
               <td><code>jest</code></td>
               <td>Framework de pruebas unitarias para JavaScript</td>
               <td><a href="https://www.npmjs.com/package/jest">NPM</a></td>
            </tr>
            <tr>
               <td><code>supertest</code></td>
               <td>Biblioteca para pruebas de APIs</td>
               <td><a href="https://www.npmjs.com/package/supertest">NPM</a></td>
            </tr>
            <tr>
               <td><code>husky</code></td>
               <td>Git hooks para mejorar el flujo de trabajo</td>
               <td><a href="https://www.npmjs.com/package/husky">NPM</a></td>
            </tr>
         </table>
      </div>
      <h2>Despliegue</h2>
      <p> El proyecto utiliza <strong>Docker</strong> para la creación de contenedores, lo que facilita el despliegue en entornos como <strong>Plesk</strong>. Se han creado imágenes Docker para el frontend y el backend, permitiendo una configuración consistente en diferentes entornos. </p>
      <h3>Pasos para el Despliegue en Plesk</h3>
      <ol>
         <li>
            <strong>Construir las imágenes Docker:</strong> 
            <pre><code>docker build -t arcodavella-frontend ./frontend docker build -t arcodavella-backend ./backend</code></pre>
         </li>
         <li> <strong>Subir las imágenes a un registro de contenedores</strong> (por ejemplo, Docker Hub). </li>
         <li>
            <strong>Configurar Docker en Plesk:</strong> 
            <ul>
               <li>Acceder al panel de control de Plesk y agregar las imágenes Docker desde el registro.</li>
               <li>Configurar los puertos y variables de entorno necesarias.</li>
               <li>Iniciar los contenedores y verificar que la aplicación esté funcionando correctamente.</li>
            </ul>
         </li>
      </ol>
      <h2>Integración Continua y Despliegue (CI/CD) con Jenkins</h2>
      <p> Se ha configurado un pipeline en <strong>Jenkins</strong> para automatizar el proceso de integración y despliegue continuo: </p>
      <ul>
         <li>Construcción automática de las imágenes Docker cada vez que hay cambios en el repositorio.</li>
         <li>Ejecución de pruebas unitarias y de integración para garantizar la calidad del código.</li>
         <li>Despliegue automático en el servidor de Plesk una vez que las pruebas son exitosas.</li>
      </ul>
      <h2>Seguridad y Manejo de Secretos</h2>
      <p> Se han implementado medidas para asegurar que las credenciales sensibles no se expongan en el repositorio: </p>
      <ul>
         <li>Uso de archivos <code>.env</code> para gestionar variables de entorno sensibles.</li>
         <li>Los archivos que contienen información confidencial están incluidos en el <code>.gitignore</code>.</li>
         <li>Implementación de hooks de pre-commit para evitar que se realicen commits con información sensible.</li>
         <li>Reescritura del historial de Git para eliminar cualquier secreto que haya sido comprometido.</li>
      </ul>
      <h2>Cómo Contribuir</h2>
      <p> Si deseas contribuir al proyecto, sigue estos pasos: </p>
      <ol>
         <li><strong>Fork</strong> del repositorio.</li>
         <li>Crea una <strong>rama</strong> para tu característica o corrección (<code>git checkout -b feature/nueva-funcionalidad</code>).</li>
         <li><strong>Confirma</strong> tus cambios (<code>git commit -m 'Añadir nueva funcionalidad'</code>).</li>
         <li><strong>Sube</strong> los cambios a tu repositorio (<code>git push origin feature/nueva-funcionalidad</code>).</li>
         <li>Abre una <strong>Pull Request</strong> en GitHub.</li>
      </ol>
      <h2>Licencia</h2>
      <p> Este proyecto está licenciado bajo la <strong>Licencia MIT</strong>. Consulta el archivo <a href="#">LICENSE</a> para más detalles. </p>
      <h2>Agradecimientos</h2>
      <p> Agradecemos a todos los colaboradores y usuarios que han contribuido al desarrollo de este proyecto. </p>
      <h2>Contacto</h2>
      <p> Para preguntas o sugerencias, puedes contactarnos en: </p>
      <ul>
         <li><strong>Email:</strong> <a href="mailto:contacto@arcodavella.com">contacto@arcodavella.com</a></li>
         <li><strong>GitHub:</strong> <a href="https://github.com/manuelxose">Manuel Xosé</a></li>
      </ul>
      <h2>Actividad del Repositorio</h2>
      <p>
         <!-- Aquí puedes incluir una imagen o gráfico de actividad del repositorio --> 
      </p>
      <h2>Aviso Legal</h2>
      <p> Los nombres y logotipos de <strong>Angular</strong>, <strong>Node.js</strong>, <strong>Docker</strong>, <strong>Plesk</strong> y <strong>Jenkins</strong> son marcas registradas de sus respectivos propietarios. </p>
      <hr>
      <p> <em>Este README ha sido generado y adaptado en función de las conversaciones anteriores y refleja las características y configuraciones del proyecto actual.</em> </p>
   </body>
</html>
