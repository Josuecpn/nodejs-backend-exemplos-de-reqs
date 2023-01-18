const express = require("express");

const server = express();

server.use(express.json());

// Query params = ?nome=NodeJS
// Route params = /curso/2
// Request Body = { nome: 'Nodejs', tipo: 'Backend'}
// Middleware são funções que trabalhando detro de cada rota

const cursos = ["Nodejs", "JavaScript", "React Native"];

// Middleware Global
server.use((req, res, next) => {
  console.log(`URL chamada: ${req.url}`);

  return next();
});

function checkCurso(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "Nome do curso é obrigatório!" });
  }

  return next();
}

function checkIndexCurso(req, res, next) {
  const curso = cursos[req.params.index];

  if (!curso) {
    return res.status(400).json({ error: "O curso não existe!" });
  }

  req.curso = curso;

  return next();
}

// consulta a listagem de cursos
server.get("/cursos", (req, res) => {
  return res.json(cursos);
});

// consulta um curso por index
server.get("/cursos/:index", checkIndexCurso, (req, res) => {
  return res.json(req.curso);
});

// Cria um novo curso
server.post("/cursos", checkCurso, (req, res) => {
  const { name } = req.body;

  cursos.push(name);

  return res.json(cursos);
});

// Edita algum curso
server.put("/cursos/:index", checkCurso, checkIndexCurso, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  cursos[index] = name;

  return res.json(cursos);
});

//Exclui algum curso
server.delete("/cursos/:index", checkIndexCurso, (req, res) => {
  const { index } = req.params;

  cursos.splice(index, 1);

  return res.send();
});

server.listen(3000);
