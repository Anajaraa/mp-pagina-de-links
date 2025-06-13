const maxLinks = 6;

// Botão para adicionar mais links no formulário
document.getElementById('addLinkButton').addEventListener('click', () => {
    const container = document.getElementById('linksInputContainer');
    const currentLinks = container.querySelectorAll('.linkInput');

    if (currentLinks.length >= maxLinks) {
        alert("Você só pode adicionar até 6 links.");
        return;
    }

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = `Nome do Link ${currentLinks.length + 1}`;
    nameInput.classList.add('linkNameInput');

    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.placeholder = `Link ${currentLinks.length + 1} (URL)`;
    urlInput.classList.add('linkInput');

    container.appendChild(nameInput);
    container.appendChild(urlInput);
});

// Submissão do formulário
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const avatarInput = document.getElementById('avatarInput').files[0];
    const name = document.getElementById('nameInput').value;
    const description = document.getElementById('descriptionInput').value;

    const nameInputs = document.querySelectorAll('.linkNameInput');
    const urlInputs = document.querySelectorAll('.linkInput');

    const links = [];
    for (let i = 0; i < urlInputs.length; i++) {
        const label = nameInputs[i] ? nameInputs[i].value || `Link ${i + 1}` : `Link ${i + 1}`;
        const url = urlInputs[i].value;
        if (url.trim()) {
            links.push({ label, url });
        }
    }

    const socialLinks = {
        instagram: document.getElementById('instagramInput')?.value || "",
        linkedin: document.getElementById('linkedinInput')?.value || "",
        twitter: document.getElementById('twitterInput')?.value || ""
    };

    const finalizeSave = (avatarData) => {
        const profileData = {
            name,
            avatar: avatarData,
            description,
            links,
            socialLinks
        };
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        displayProfile(profileData);
    };

    if (avatarInput) {
        const reader = new FileReader();
        reader.onload = function(event) {
            finalizeSave(event.target.result);
        };
        reader.readAsDataURL(avatarInput);
    } else {
        const saved = JSON.parse(localStorage.getItem('userProfile'));
        finalizeSave(saved?.avatar || "");
    }
});

// Exibir perfil
function displayProfile(data) {
    document.getElementById('profileForm').style.display = 'none';
    document.getElementById('profileDisplay').style.display = 'block';

    document.getElementById('avatar').src = data.avatar;

    const nameParts = data.name.trim().split(' ');
    const lastName = nameParts.pop();
    const firstName = nameParts.join(' ');
    document.getElementById('name').innerHTML = `${firstName} <strong>${lastName}</strong>`;

    document.getElementById('description').textContent = data.description;

    const linksContainer = document.getElementById('links');
    linksContainer.innerHTML = '';
    data.links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.label;
        a.target = "_blank";
        linksContainer.appendChild(a);
    });

    document.getElementById('instagram').href = data.socialLinks.instagram;
    document.getElementById('linkedin').href = data.socialLinks.linkedin;
    document.getElementById('twitter').href = data.socialLinks.twitter;
}

// Editar perfil
document.getElementById('editProfile').onclick = function () {
    const profile = JSON.parse(localStorage.getItem('userProfile'));
    if (!profile) return;

    document.getElementById('profileForm').style.display = 'block';
    document.getElementById('profileDisplay').style.display = 'none';

    document.getElementById('nameInput').value = profile.name;
    document.getElementById('descriptionInput').value = profile.description;

    if (document.getElementById('instagramInput')) {
        document.getElementById('instagramInput').value = profile.socialLinks.instagram || "";
        document.getElementById('linkedinInput').value = profile.socialLinks.linkedin || "";
        document.getElementById('twitterInput').value = profile.socialLinks.twitter || "";
    }

    const linksContainer = document.getElementById('linksInputContainer');
    linksContainer.innerHTML = '';

    profile.links.forEach((link, index) => {
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'linkNameInput';
        nameInput.placeholder = `Nome do Link ${index + 1}`;
        nameInput.value = link.label;

        const urlInput = document.createElement('input');
        urlInput.type = 'url';
        urlInput.className = 'linkInput';
        urlInput.placeholder = `Link ${index + 1} (URL)`;
        urlInput.value = link.url;

        linksContainer.appendChild(nameInput);
        linksContainer.appendChild(urlInput);
    });
};

// Excluir perfil
document.getElementById('deleteProfile').onclick = function () {
    if (confirm('Tem certeza que deseja apagar o perfil?')) {
        localStorage.removeItem('userProfile');
        location.reload();
    }
};

// Adicionar novo link após perfil criado
document.getElementById('addNewLink').addEventListener('click', () => {
    const linkURL = prompt("Cole o novo link que deseja adicionar:");
    const linkLabel = prompt("Dê um nome ao seu link:");

    if (!linkURL || !linkURL.startsWith("http")) {
        alert("Link inválido.");
        return;
    }

    let profile = JSON.parse(localStorage.getItem('userProfile'));
    if (!profile) return;

    if (profile.links.length >= 6) {
        alert("Você já adicionou o máximo de 6 links.");
        return;
    }

    profile.links.push({ label: linkLabel || `Link ${profile.links.length + 1}`, url: linkURL });

    localStorage.setItem('userProfile', JSON.stringify(profile));
    displayProfile(profile);
});

// Ao carregar a página
window.onload = function () {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        displayProfile(JSON.parse(savedProfile));
    }
};
