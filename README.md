# Jenkins Pipeline Workshop

## Objetivo

Demostrar las ventajas de tener configuraciones ágiles de CI/CD en pro de una entregabilidad de producto lo suficientemente preparada como para que no haya fricción en el proceso de release.

El workshop se hizo en las oficinas de Kairós Digital Solutions de Castellana 43 el jueves 15 de marzo de 2018. Es la continuación de la charla sobre Jenkins y Entregabilidad https://github.com/red-panda-ci/jenkins-workshop que se celebró en las oficinas de Gigigo Mobile Services de Doctor Zamenhof, 36 el miércoles 21 de febrero de 2018.

## Medios

### Herramientas

* Jenkins: orquestador de CI/CD https://jenkins.io
* SonarQube: plataforma de evaluación de la calidad del código https://www.sonarqube.org
* Rancher: plataforma de ejecución https://rancher.com

### Piezas de CI/CD

* Generator Redpanda Node Module https://github.com/red-panda-ci/generator-redpanda-node-module para hacer scafolding del proyecto.
* Node Commit Validator https://github.com/madoos/node-commit-validator usado como validador de mensajes de commit.
* Node Changelog Generator https://github.com/red-panda-ci/node-changelog-generator para generar archivos CHANGELOG a partir de los mensajes de commit.
* Npm Command Runner https://github.com/red-panda-ci/npm-command-runner para dar contexto de ejecución "npm" desacoplada.
* Rancher Compose https://github.com/red-panda-ci/rancher-compose para el despliegue del producto.
* Jenkins Pipeline Library https://github.com/red-panda-ci/jenkins-pipeline-library como librereía de apoyo en el pipeline.

## Producto

Nos serviremos de un producto NodeJS con todas las capacidades de CI/CD embarcadas. Trabajaremos en todas las etapas del producto, desde la creación del repositorio hasta el delivery de las sucesivas releases.

### Objetivo

Preparar una aplicación NodeJS que ofrezca un respuesta HTTP de status con la máxima calidad posible. Como requisitos de calidad nos solicitan:

* El código fuente debe seguir las reglas StandardJS https://standardjs.com/
* Los mensajes de commit deben cumplir las reglas "eslint" https://eslint.org/docs/developer-guide/contributing/pull-requests
* Nuestro código debe tener testing con las métricas e informes accesibles.
* Debemos proporcionar un método para revisar vulnerabilidades comunes en las dependencias.
* Al tratarse de un proyecto público:
  * Debe estar alojado en una organización Github.
  * Debe presentar un código de conducta para contribuciones.
* Debe disponer de un pipeline CI/CD configurado con Jenkins con generación automática de releases.
* Cada release debe disponer de su propio Changelog detallado.

El proyecto tiene que estar configurado en Jenkins, con SonarQube y desplegado en Rancher.

En el workshop cerraremos la release v1.0.0 revisando los badgets para poner el de Jenkins https://jenkins.redpandaci.com/buildStatus/icon?job=jenkins-workshop-kairosds/api-status/develop

### Receta

#### Requisitos

Debemos tener clave ssh de nuestro usuario autorizada en Github. Respecto al software y aplicaciones instaladas:

* NodeJS >= 7.x
* Yeoman >= 2.x
```shell
$ npm install -g yo
```
* Generator Redpanda Node Module
```shell
$ npm install -g generator-redpanda-node-module
```

De cara a las herramientas de CI/CD es necesario tener configurado un Jenkins conectado a una organización Github tal y como se explica en "jenkins-workshop" https://github.com/red-panda-ci/jenkins-workshop

### Procedimiento

Creamos el proyecto sirviéndonos del generador "Generator Redpanda Node Module", basado en Yeoman:

```shell
$ yo redpanda-node-module


     _-----_     ╭──────────────────────────╮
    |       |    │ Welcome to the beautiful │
    |--(o)--|    │ generator-redpanda-node- │
   `---------´   │     module generator!    │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |     
   __'.___.'__   
 ´   `  |° ´ Y ` 

? Project name: api-status
? Description: Yet Another Monitoring Api Status
? Author: Pedro Amador Rodríguez
? Email: pedroamador.rodriguez@gmail.com
? Select a commit style preset eslint
? Create remote repository? Yes
? Select a repo type Organization
? Select a Git provider Github
? Git organization: jenkins-workshop-kairosds
? Sync remote repository? Yes
? Select authentication type User and Password
? User: pedroamador
? Password: [hidden]
? Keyword separated by coma api,monitoring,nodejs
? Add CLI? No
   create package.json
   create .coveralls.yml
   create .editorconfig
   create .eslintignore
   create .eslintrc
   create .npmignore
   create .travis.yml
   create CODE_OF_CONDUCT.md
   create Jenkinsfile
   create LICENSE
   create README.md
   create .gitignore
   create bin/coveralls.sh
   create bin/deploy.sh
   create bin/get-release.sh
   create bin/publish.sh
   create bin/test.sh
   create index.js
   create sonar-project.properties
   create src/myLib.js
   create test/dummy.js
   create test/index.js


I'm all done. Running npm install for you to install the required dependencies. If this fails, try running the command yourself.



> husky@0.14.3 install /Users/pedro.rodriguez/workspace/api-status/node_modules/husky
> node ./bin/install.js

husky
setting up Git hooks
done

npm WARN prepublish-on-install As of npm@5, `prepublish` scripts are deprecated.
npm WARN prepublish-on-install Use `prepare` for build steps and `prepublishOnly` for upload-only.
npm WARN prepublish-on-install See the deprecation note in `npm help scripts` for more information.

> api-status@0.0.0 prepublish /Users/pedro.rodriguez/workspace/api-status
> nsp check

(+) No known vulnerabilities found
npm notice created a lockfile as package-lock.json. You should commit this file.
added 770 packages in 13.394s
The following paths are ignored by one of your .gitignore files:
node_modules
Use -f if you really want to add them.
Command failed: git add * .*[a-zA-Z0-9]
The following paths are ignored by one of your .gitignore files:
node_modules
Use -f if you really want to add them.

husky > npm run -s precommit (node v9.8.0)

[18:39:09] Running tasks for *.js [started]
[18:39:09] Running tasks for *.json [started]
[18:39:09] eslint --fix [started]
[18:39:09] prettier --write [started]
[18:39:10] eslint --fix [completed]
[18:39:10] git add [started]
[18:39:10] git add [completed]
[18:39:10] Running tasks for *.js [completed]
[18:39:10] prettier --write [completed]
[18:39:10] git add [started]
[18:39:10] git add [completed]
[18:39:10] Running tasks for *.json [completed]
husky > npm run -s commitmsg (node v9.8.0)

Switched to a new branch 'master'
Switched to branch 'develop'
To github.com:jenkins-workshop-kairosds/api-status.git
 * [new branch]      develop -> develop
To github.com:jenkins-workshop-kairosds/api-status.git
 * [new branch]      master -> master
```

Una vez que tenemos las configuraciones en nuestro proyecto, comenzamos el desarrollo. Dado que no es el objeto de este workshop, tenemos los ficheros en el directorio "api-monitoring-files", sólo tendremos que copiarlas a nuestro proyecto:

```shell
$ cp -rv jenkins-pipeline-workshop/api-monitoring-files api-monitoring
jenkins-pipeline-workshop/api-monitoring-files -> api-monitoring/api-monitoring-files
jenkins-pipeline-workshop/api-monitoring-files/test -> api-monitoring/api-monitoring-files/test
jenkins-pipeline-workshop/api-monitoring-files/test/index.js -> api-monitoring/api-monitoring-files/test/index.js
jenkins-pipeline-workshop/api-monitoring-files/test/app.js -> api-monitoring/api-monitoring-files/test/app.js
jenkins-pipeline-workshop/api-monitoring-files/Dockerfile -> api-monitoring/api-monitoring-files/Dockerfile
jenkins-pipeline-workshop/api-monitoring-files/index.js -> api-monitoring/api-monitoring-files/index.js
jenkins-pipeline-workshop/api-monitoring-files/README.md -> api-monitoring/api-monitoring-files/README.md
jenkins-pipeline-workshop/api-monitoring-files/docker-compose-test.yml -> api-monitoring/api-monitoring-files/docker-compose-test.yml
jenkins-pipeline-workshop/api-monitoring-files/package-lock.json -> api-monitoring/api-monitoring-files/package-lock.json
jenkins-pipeline-workshop/api-monitoring-files/package.json -> api-monitoring/api-monitoring-files/package.json
jenkins-pipeline-workshop/api-monitoring-files/docker-compose-production.yml -> api-monitoring/api-monitoring-files/docker-compose-production.yml
jenkins-pipeline-workshop/api-monitoring-files/Jenkinsfile -> api-monitoring/api-monitoring-files/Jenkinsfile
jenkins-pipeline-workshop/api-monitoring-files/deploy.sh -> api-monitoring/api-monitoring-files/deploy.sh
jenkins-pipeline-workshop/api-monitoring-files/src -> api-monitoring/api-monitoring-files/src
jenkins-pipeline-workshop/api-monitoring-files/src/app.js -> api-monitoring/api-monitoring-files/src/app.js
```

Tests
=====

Tenemos disponibles los siguientes test para nuestro proyecto:

```script
$ npm run lint
$ npm run pretest
$ npm run test
$ npm run serve:coverage
$ npm run precommit
```

TODO
====

[ ] Arreglar configuración de Sonar para que recoja la cobertura
