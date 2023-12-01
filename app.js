var repos;
var order = "asc";
$(document).ready(function () {
  $("#search").click(function () {
    var username = $("#username").val();
    if (username === "") return;

    getUserProfile(username);
    getUserRepos(username);
  });

  $("thead th").on("click", function () {
    var column = $(this).data("col");

    const sortedRepos = sortByColumn(column, order);
    displayUserRepos(sortedRepos);
    order = order === "asc" ? "desc" : "asc";
  });

  if (window.location.pathname.includes("details.html")) {
    const urlParams = new URLSearchParams(window.location.search);

    const name = urlParams.get("name");
    const description = urlParams.get("description");
    const startgazers_count = urlParams.get("startgazers_count");
    const language = urlParams.get("language");
    const html_url = urlParams.get("html_url");

    const detailsContainer = $("#details-container");
    detailsContainer.empty();

    const detailsCard = `
      <div>
        <h2>${name}</h2>
        <p class="lead mt-3 mb-5">${description || "Descrição indisponível"}</p>
        <p>
          Estrelas:
          <span class="badge">${startgazers_count}</span>
        </p>
        <p>
          Linguagem utilizada: 
          <span class="label label-primary">${language}</span>
        </p>
        <a href="${html_url}">Ver repositório</a>
      </div>
    `;

    detailsContainer.append(detailsCard);
  }
});

function sortByColumn(column, asc = "asc") {
  const orderAsc = asc.toLowerCase() === "asc";

  return [...repos].sort((a, b) => {
    const valueA = a[column];
    const valueB = b[column];

    if (typeof valueA === "string" || typeof valueB === "string") {
      const stringA = String(valueA).toLocaleLowerCase();
      const stringB = String(valueB).toLocaleLowerCase();

      return (
        (stringA < stringB ? -1 : stringA > stringB ? 1 : 0) *
        (orderAsc ? 1 : -1)
      );
    } else {
      return (valueA - valueB) * (orderAsc ? 1 : -1);
    }
  });
}

async function getUserProfile(username) {
  const apiUrl = `https://api.github.com/users/${username}`;

  try {
    const response = await axios(apiUrl);

    displayUserProfile(response.data);
  } catch {
    console.error("Erro na requisição");
    displayError();
  }
}
function displayUserProfile(user) {
  const { avatar_url, login, bio, html_url, email, followers, following } =
    user;

  console.log(user);

  const profileContainer = $("#profile-container");
  profileContainer.empty();

  const profileCard = `
    <div class="card">
        <div class="row">
            <div class="col-md-6">
                <img src="${avatar_url}" class="card-img" alt="User Avatar">
            </div>
            <div class="col-md-6">
                <div class="card-body">
                    <h5 class="card-title">${login}</h5>
                    <p class="card-text">${email || "email indisponível"}</p>
                    <p class="card-text">${bio || "bio indisponível"}</p>
                    <p class="card-text">nº de seguidores: ${followers}</p>
                    <p class="card-text">Seguindo ${following} usuários</p>                    
                    <a href="${html_url}" class="btn btn-primary" target="_blank">Ver perfil</a>
                </div>
            </div>
        </div>
    </div>
`;

  profileContainer.append(profileCard);
}

async function getUserRepos(username) {
  const repoUrl = `https://api.github.com/users/${username}/repos?sort=stargazers_count&direction=desc`;

  try {
    const response = await axios(repoUrl);
    repos = response.data;
    displayUserRepos(repos);
  } catch {
    console.error("Erro na requisição");
    displayError();
  }
}

function displayUserRepos(repos) {
  const tbody = $("#repo-table");
  tbody.empty();

  repos.forEach(function (repo) {
    const { name, description, stargazers_count, language, html_url } = repo;
    console.log(repo);
    const anchorTag = `
    <a href="details.html?name=${name}&description=${description}&startgazers_count=${stargazers_count}&language=${language}&html_url=${html_url}">Detalhes</a>
    `;
    const row = `
        <tr>
            <td>${repo.name}</td>
            <td>${repo.stargazers_count}</td>
            <td>${anchorTag}
            </td>
        </tr>`;

    tbody.append(row);
  });
}

function displayError() {
  const profileContainer = $("#profileContainer");
  profileContainer.empty();

  profileContainer.append('<p class="text-danger">Usuário não encontrado.</p>');
}
