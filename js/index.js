document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');

    searchForm.addEventListener('submit', event => {
      event.preventDefault();
      const searchTerm = searchInput.value;
      searchUsers(searchTerm);
    });
//creating a function to search users 
    function searchUsers(searchTerm) {
      const url = `https://api.github.com/search/users?q=${searchTerm}`;
      fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(response => response.json())
        .then(data => {
          displayUsers(data.items);
        })
        .catch(error => {
          console.error('Error searching users:', error);
        });
    }

    function displayUsers(users) {
      resultsContainer.innerHTML = '';
      users.forEach(user => {
        const userCard = createUserCard(user);
        resultsContainer.appendChild(userCard);
        userCard.addEventListener('click', () => {
          getRepositories(user.login);
        });
      });
    }
//writing function to create user card

    function createUserCard(user) {
      const card = document.createElement('div');
      card.classList.add('user-card');
      card.innerHTML = `
        <img src="${user.avatar_url}" alt="User Avatar" class="avatar">
        <h3 class="username" data-username="${user.login}">${user.login}</h3>
        <a href="${user.html_url}" target="_blank" class="profile-link">View Profile</a>
      `;
      return card;
    }
    function getRepositories(username) {
      const url = `https://api.github.com/users/${username}/repos`;
      fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(response => response.json())
        .then(data => {
          displayRepositories(username, data);
        })
        .catch(error => {
          console.error('Error getting repositories:', error);
        });
    }
//writing function to display repositories
    function displayRepositories(username, repositories) {
      const userCard = document.querySelector(`.user-card h3.username[data-username="${username}"]`);
      const repositoryList = document.createElement('ul');
      repositoryList.classList.add('repository-list');
      repositories.forEach(repository => {
        const repositoryItem = document.createElement('li');
        repositoryItem.textContent = repository.name;
        repositoryList.appendChild(repositoryItem);
      });
      userCard.parentNode.insertBefore(repositoryList, userCard.nextSibling);
    }
  });