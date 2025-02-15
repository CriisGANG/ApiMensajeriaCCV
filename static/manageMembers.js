document.addEventListener("DOMContentLoaded", function () {
    const usersList = document.getElementsByClassName("users");
    const exitButton = document.getElementById("exitButton");
    const addUserButton = document.getElementById("addUserButton");
    const addUserModal = document.getElementById("addUserModal");
    const manageMemberModal = document.getElementById("manageMemberModal");
    const closeButton = document.querySelectorAll(".close-button");
    const addUserToGroupButton = document.getElementById("addUserToGroupButton");
    const userSelect = document.getElementById("userSelect");
    const removeMemberButton = document.getElementById("removeMemberButton");
    const makeAdminButton = document.getElementById("makeAdminButton");
    const demoteMemberButton = document.getElementById("demoteMemberButton");
    const manageMemberTitle = document.getElementById("manageMemberTitle");

    exitButton.addEventListener("click", function () {
        const groupId = document.querySelector('.centered-container').getAttribute('data-group-id');
        window.location.href = `/chatsGrupos/${groupId}`;
    });

    addUserButton.addEventListener("click", function () {
        addUserModal.style.display = "block";
    });

    closeButton.forEach(button => {
        button.addEventListener("click", function () {
            addUserModal.style.display = "none";
            manageMemberModal.style.display = "none";
        });
    });

    addUserToGroupButton.addEventListener("click", function () {
        const userId = userSelect.value;
        const groupId = document.querySelector('.centered-container').getAttribute('data-group-id');
        addUserToGroup(userId, groupId);
    });

    window.addEventListener("click", function (event) {
        if (event.target == addUserModal) {
            addUserModal.style.display = "none";
        }
        if (event.target == manageMemberModal) {
            manageMemberModal.style.display = "none";
        }
    });

    function addUserToGroup(userId, groupId) {
        fetch('/add_user_to_group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId, group_id: groupId })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.status === 'success') {
                alert('Usuario añadido al grupo.');
                location.reload(); // Reload the page to show the updated user list
            } else {
                alert(`Failed to add user: ${data.message}`);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while adding the user.');
        });
    }

    for (let user of usersList) {
        user.addEventListener("click", function () {
            const userId = user.getAttribute("data-id");
            const username = user.getAttribute("data-username");
            const isAdmin = user.getAttribute("data-is-admin") === "1";
            const groupId = document.querySelector('.centered-container').getAttribute('data-group-id');
            manageMemberTitle.textContent = `Gestionar ${username}`;
            manageMemberTitle.style.color = "black";
            manageMemberModal.style.display = "block";

            removeMemberButton.onclick = function () {
                sendMemberAction(userId, username, groupId, "remove", user);
                manageMemberModal.style.display = "none";
            };

            if (isAdmin) {
                makeAdminButton.style.display = "none";
                demoteMemberButton.style.display = "block";
                demoteMemberButton.onclick = function () {
                    sendMemberAction(userId, username, groupId, "demote", user);
                    manageMemberModal.style.display = "none";
                };
            } else {
                makeAdminButton.style.display = "block";
                demoteMemberButton.style.display = "none";
                makeAdminButton.onclick = function () {
                    sendMemberAction(userId, username, groupId, "makeAdmin", user);
                    manageMemberModal.style.display = "none";
                };
            }
        });
    }
});

function sendMemberAction(userId, username, groupId, action, userElement) {
    console.log(`Sending action: ${action} for User ID: ${userId}, Username: ${username}, Group ID: ${groupId}`);
    fetch('/manage_member_action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId, username: username, group_id: groupId, action: action })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.status === 'success') {
                if (action === 'remove') {
                    userElement.remove(); // Remove the user from the list
                } else if (action === 'makeAdmin') {
                    alert(`${userElement.textContent} ha sido promovido a administrador.`);
                    userElement.setAttribute("data-is-admin", "1"); // Update the data-is-admin attribute
                    makeAdminButton.style.display = "none"; // Hide the makeAdminButton
                } else if (action === 'demote') {
                    alert(`${userElement.textContent} ha sido degradado a miembro.`);
                    userElement.setAttribute("data-is-admin", "0"); // Update the data-is-admin attribute
                    demoteMemberButton.style.display = "none"; // Hide the demoteMemberButton
                }
            } else {
                alert(`Failed to perform action: ${data.message}`);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while performing the action.');
        });
}
