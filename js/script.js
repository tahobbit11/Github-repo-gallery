const overview = document.querySelector(".overview");
const username = "tahobbit11";
const ul = document.querySelector(".repo-list");
const repos = document.querySelector(".repos");
const repoData = document.querySelector(".repo-data");
const viewReposButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

const githubProfile = async function(){
    const userInfo = await fetch(`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    displayInfo(data);
};

githubProfile();

const displayInfo = function(data){
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
    <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div> 
    `;
    overview.append(div);
    githubRepo();
};

const githubRepo = async function(){
    const repoInfo = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await repoInfo.json();
    displayRepo(repoData);
};

const displayRepo = function(repos){
    filterInput.classList.remove("hide");
    for(const repo of repos){
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        ul.append(repoItem);
    }
};

ul.addEventListener("click",function(e){
    if(e.target.matches("h3")) {
        const repoName = e.target.innerText;
        githubRepoInfo(repoName);
    }
});

const githubRepoInfo = async function(repoName){
    const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoSpecific = await fetchInfo.json();
    console.log(repoSpecific);

    const fetchLanguages = await fetch(repoSpecific.languages_url);
    const languageData = await fetchLanguages.json();
    console.log(languageData);

    const languages = [];
    for (const language in languageData){
        languages.push(language);
    }

    displayRepoSpecific(repoSpecific, languages);
}

const displayRepoSpecific = function(repoSpecific, languages){
    viewReposButton.classList.remove("hide");
    repoData.innerHTML = "";
    repoData.classList.remove("hide");
    repos.classList.add("hide");
    const div = document.createElement("div");
    div.innerHTML = `
    <h3>Name: ${repoSpecific.name}</h3>
    <p>Description: ${repoSpecific.description}</p>
    <p>Default Branch: ${repoSpecific.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoSpecific.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    repoData.append(div);
}

viewReposButton.addEventListener("click",function(){
    repos.classList.remove("hide");
    repoData.classList.add("hide");
    viewReposButton.classList.add("hide");
});

filterInput.addEventListener("input", function(e){
    const searchText = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const searchLowerText = searchText.toLowerCase();

    for (const repo of repos){
        const repoLowerText = repo.innerText.toLowerCase();
        if(repoLowerText.includes(searchLowerText)){
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});