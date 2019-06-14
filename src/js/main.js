
function loadUserInfoToSidebar(username) {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', `/users/${username}`, false);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  xhr.onload = function(e) {
    if (xhr.readyState !== 4) return;

    if (xhr.status !== 200) {
      return alert('Something goes wrong...\n '+xhr.status);
    }

    const json = JSON.parse(xhr.responseText);

    const header = document.getElementById('right-sidebar__header');
    const info = document.getElementById('right-sidebar__info');

    header.innerText = json.username;
    info.innerText = json.bio;
  };

  xhr.send();
}
