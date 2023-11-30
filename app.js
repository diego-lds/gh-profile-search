$(document).ready(function () {
  $("#search").click(function () {
    var username = $("#username").val();
    if (username === "") return;
    username = "octocat";
    getUserProfile(username);
    getUserRepos(username);
  });
});

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

    displayUserRepos(response.data);
  } catch {
    console.error("Erro na requisição");
    displayError();
  }
}

function displayUserRepos(repos) {
  const reposContainer = $("#repos-container");
  reposContainer.empty();

  $("#repos-list").empty();

  $.each(repos, function (index, item) {
    $("#repos-list").append(`
    <li class='list-group-item d-flex'>
        <div>
            <span>${item.full_name}</span></br>
            <span>Stars:${item.stargazers_count}</span>
        </div>
    </li>`);
  });
}

function displayError() {
  const profileContainer = $("#profileContainer");
  profileContainer.empty();

  profileContainer.append('<p class="text-danger">Usuário não encontrado.</p>');
}
