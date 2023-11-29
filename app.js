$(document).ready(function () {
    $('#search').click(function () {
        const username = $('#username').val()
        if (username === '') return

        getUserProfile(username)
    })
})

async function getUserProfile(username) {
    try {
        const response = await axios(`https://api.github.com/users/${username}`)
        console.log(response.data)

        displayUserProfile(response.data)
        console.log
    } catch {
        console.error('Erro na requisição')
        displayError()
    }
}

function displayUserProfile(user) {
    const { avatar_url, login, bio, html_url, email, followers, following } =
        user

    const profileContainer = $('#profile-container')
    profileContainer.empty()

    const profileCard = `
    <div class="card">
        <div class="row">
            <div class="col-md-6">
                <img src="${avatar_url}" class="card-img" alt="User Avatar">
            </div>
            <div class="col-md-6">
                <div class="card-body">
                    <h5 class="card-title">${login}</h5>
                    <p class="card-text">${email || 'email indisponível'}</p>
                    <p class="card-text">${bio || 'bio indisponível'}</p>
                    <p class="card-text">nº de seguidores: ${followers}</p>
                    <p class="card-text">Seguindo ${following} usuários</p>                    
                    <a href="${html_url}" class="btn btn-primary" target="_blank">Ver perfil</a>
                </div>
            </div>
        </div>
    </div>
`

    profileContainer.append(profileCard)
}

function displayError() {
    const profileContainer = $('#profileContainer')
    profileContainer.empty()

    profileContainer.append(
        '<p class="text-danger">Usuário não encontrado.</p>'
    )
}
