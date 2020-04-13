const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());


function validateId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).send({ errorMessage: "Invalid Repository ID" });
  }

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  if (repositoryIndex >= 0) {
    repositories[repositoryIndex] = repository;
    return response.json(repository);
  } else {
    return response.status(400).send({ errorMessage: "Repository Not Found." });
  }
});

app.delete("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
    return response.status(204).send();
  } else {
    return response.status(400).send({ errorMessage: "Repository Not Found." });
  }
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex >= 0) {
    repositories[repositoryIndex].likes += 1;
    return response.json(repositories[repositoryIndex]);
  } else {
    return response.status(400).send({ errorMessage: "Repository Not Found" });
  }
});

module.exports = app;
